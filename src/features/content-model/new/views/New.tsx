import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import * as z from 'zod';

const DiagramEdit = dynamic(
  () => import('@/src/features/diagram/components/DiagramEdit/DiagramEdit'),
  { ssr: false },
);

import createContentModel from '@/src/features/content-model/api/createContentModel';
import Details, {
  DetailsData,
} from '@/src/features/content-model/components/Details/Details';
import ImportChoice, {
  ImportTypeChoices,
  importTypeChoiceSchema,
} from '@/src/features/content-model/new/components/ImportChoice/ImportChoice';
import JSONInput from '@/src/features/content-model/new/components/JSONInput/JSONInput';
import ManualImport from '@/src/features/content-model/new/components/ManualImport/ManualImport';
import OAuthImport from '@/src/features/content-model/new/components/OAuthImport/OAuthImport';
import { SpaceImportData } from '@/src/features/content-model/new/types/spaceImport';
import parseContentModel from '@/src/features/content-model/parsing/parseContentModel';
import contentModelSchema from '@/src/features/content-model/types/contentModel';
import addAssetToContentModel from '@/src/features/content-model/utilities/addAssetToContentModel';
import contentModelPositionSchema from '@/src/features/diagram/types/contentModelPosition';
import contentTypePositionSchema from '@/src/features/diagram/types/contentTypePosition';
import approximateInitialContentModelPosition from '@/src/features/diagram/utilities/approximateInitialContentModelPosition';
import Footer from '@/src/features/footer/Footer';
import Header from '@/src/features/header/components/Header/Header';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { getInputClassName } from '@/src/shared/components/Input/getInputClassName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentTypesSelection from '../../components/ContentTypesSelection/ContentTypesSelection';

type NewViewStep =
  | 'contentModelInput'
  | 'contentTypesSelection'
  | 'appearanceInput'
  | 'detailsInput'
  | 'success';

const NewView: React.FC = observer(() => {
  const router = useRouter();

  const [viewStep, setViewStep] = useState<NewViewStep>('contentModelInput');
  const [viewError, setViewError] = useState<string | null>(null);

  // Diagram details
  const [contentModelPosition, setContentModelPosition] = useState<
    z.infer<typeof contentModelPositionSchema>
  >({
    contentTypes: {},
  });
  const [
    initialContentModelPosition,
    setInitialContentModelPosition,
  ] = useState<z.infer<typeof contentModelPositionSchema>>({
    contentTypes: {},
  });
  const [contentTypePositionChanged, setContentTypePositionChanged] = useState(
    false,
  );

  const onContentTypeDrag = useCallback(
    (
      contentTypeId: string,
      newPosition: z.infer<typeof contentTypePositionSchema>,
    ) => {
      setContentModelPosition((position) => ({
        contentTypes: {
          ...position.contentTypes,
          [contentTypeId]: newPosition,
        },
      }));
      setContentTypePositionChanged(true);
    },
    [],
  );

  // Import choice
  const defaultImportChoice = useMemo<ImportTypeChoices | undefined>(() => {
    if (typeof router.query.importType === undefined) {
      return;
    }

    try {
      const parsedChoice = importTypeChoiceSchema.parse(
        router.query.importType,
      );

      return parsedChoice;
    } catch {
      return;
    }
  }, [router.query]);
  const [importType, setImportType] = useState<ImportTypeChoices | undefined>(
    defaultImportChoice,
  );

  // We preserver space id + delivery API key temporarily in case they go back
  const [spaceImportDetails, setSpaceImportDetails] = useState<SpaceImportData>(
    {
      spaceId: '',
      token: '',
      environmentId: '',
    },
  );

  const [contentModelJSONText, setContentModelJSONText] = useState('');
  const [parsedContentModel, setParsedContentModel] = useState<
    z.infer<typeof contentModelSchema>
  >();
  const [chosenContentTypes, setChosenContentTypes] = useState<string[]>();
  const finalContentModel = useMemo(() => {
    if (parsedContentModel === undefined || chosenContentTypes === undefined) {
      return parsedContentModel;
    }

    return parsedContentModel.filter(
      (contentType) =>
        contentType.internal === true ||
        chosenContentTypes.includes(contentType.sys.id),
    );
  }, [parsedContentModel, chosenContentTypes]);
  const validateContentModel = (contentModelText: string): void => {
    const parseResults = parseContentModel(contentModelText);

    if (parseResults.success === false) {
      setViewError(
        importType === 'copyPaste'
          ? 'We could not parse the JSON provided, copy-paste the full JSON as exported via either Contentful CLI or the Delivery API'
          : 'Could not fetch the content model from the API. Check that you have provided the correct details.',
      );
      return;
    }

    const contentModel = addAssetToContentModel(parseResults.data);

    setParsedContentModel(contentModel);
    setViewError(null);
    setViewStep('contentTypesSelection');
  };

  // Content model details
  const [contentModelDetails, setContentModelDetails] = useState<DetailsData>({
    title: '',
    description: '',
    visibility: 'PUBLIC',
  });

  // Created content model
  const [
    createdContentModelSlug,
    setCreatedContentModelSlug,
  ] = useState<string>();

  // Create content model
  const createContentModelMutation = useMutation(createContentModel, {
    onSuccess: (createdContentModel) => {
      setCreatedContentModelSlug(createdContentModel.createContentModel.slug);
      setViewStep('success');
    },
  });
  const onCreateContentModel = (overrideContentModelDetails?: DetailsData) => {
    createContentModelMutation.mutate({
      title: overrideContentModelDetails?.title ?? contentModelDetails.title,
      description:
        overrideContentModelDetails?.description ??
        contentModelDetails.description,
      visibility:
        overrideContentModelDetails?.visibility ??
        contentModelDetails.visibility,
      version: {
        model: JSON.stringify(finalContentModel),
        position: JSON.stringify(contentModelPosition),
      },
    });
  };

  const BackToImporting = (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center flex-wrap mt-4">
        <p className="text-base text-green-700 dark:text-green-400 text-center mt-2">
          <FontAwesomeIcon icon={['fal', 'check']} className="mr-2" /> Content
          model successfully imported.{' '}
        </p>
        <Button
          size="s"
          grow={false}
          className="mt-2 mx-2"
          onClick={() => {
            setViewError(null);
            setViewStep('contentModelInput');
          }}
        >
          Change import settings
        </Button>
      </div>
    </div>
  );

  const BackToAppearance = (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center flex-wrap mt-4">
        <p className="text-base text-green-700 dark:text-green-400 text-center mt-2">
          <FontAwesomeIcon icon={['fal', 'check']} className="mr-2" /> Content
          model appearance perfected.{' '}
        </p>
        <Button
          size="s"
          grow={false}
          className="mt-2 mx-2"
          onClick={() => {
            setViewError(null);
            setViewStep('appearanceInput');
          }}
        >
          Edit appearance
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 pb-8">
        <div className="w-full max-w-xl mt-12 mx-auto">
          <h1 className="text-2xl font-bold text-center md:text-4xl">
            Visualize content model
          </h1>
          {viewStep === 'contentModelInput' ? (
            <>
              <ImportChoice
                defaultValue={importType}
                onChoice={(choice) => {
                  setViewError(null);
                  setImportType(choice);
                }}
              />
              {importType === 'copyPaste' ? (
                <JSONInput
                  contentModelJSONText={contentModelJSONText}
                  onChange={(value) => {
                    setContentModelJSONText(value.trim());
                  }}
                  validateContentModel={validateContentModel}
                  viewError={viewError}
                />
              ) : null}
              {importType === 'spaceimport' ? (
                <ManualImport
                  spaceImportDetails={spaceImportDetails}
                  setSpaceImportDetails={setSpaceImportDetails}
                  onChange={(value) => {
                    setContentModelJSONText(value.trim());
                  }}
                  validateContentModel={validateContentModel}
                  viewError={viewError}
                  setViewError={setViewError}
                />
              ) : null}
              {importType === 'oauth' ? (
                <OAuthImport
                  oauthImportDetails={spaceImportDetails}
                  setOAuthImportDetails={setSpaceImportDetails}
                  onChange={(value) => {
                    setContentModelJSONText(value.trim());
                  }}
                  validateContentModel={validateContentModel}
                  viewError={viewError}
                  setViewError={setViewError}
                />
              ) : null}
            </>
          ) : null}
        </div>
        {viewStep === 'contentTypesSelection' ? (
          <>
            {BackToImporting}
            <div className="w-full max-w-xl mx-auto mt-6 md:mt-8">
              <h2 className="text-lg font-medium">
                Optionally, if you wish to exclude some content types, you can
                uncheck them at this step.
              </h2>
              {parsedContentModel !== undefined ? (
                <ContentTypesSelection
                  contentModel={parsedContentModel}
                  defaultChosenContentTypes={chosenContentTypes}
                  onChange={(newChosenContentTypes) => {
                    setChosenContentTypes(newChosenContentTypes);
                  }}
                  className="mt-8"
                />
              ) : null}
              <footer className="flex justify-end mt-4 md:mt-8">
                <Button
                  color="primary"
                  onClick={() => {
                    setViewError(null);
                    setViewStep('appearanceInput');

                    const startingContentModelPosition = approximateInitialContentModelPosition(
                      finalContentModel ?? [],
                    );

                    setInitialContentModelPosition(
                      startingContentModelPosition,
                    );
                    setContentModelPosition(startingContentModelPosition);
                  }}
                >
                  Go to visualization
                </Button>
              </footer>
            </div>
          </>
        ) : null}
        {viewStep === 'appearanceInput' ? (
          <>
            {BackToImporting}
            <div className="w-full">
              {finalContentModel !== undefined ? (
                <>
                  <p className="text-base max-w-xl mx-auto mt-6 md:mt-8">
                    On the diagram below, arrange your content types as you
                    would like for them to be shown to others. Note that the
                    zoom level is not important/saved, and neither is the global
                    position of content types, only their relationship matters.
                    <b>
                      The view itself will always be zoomed in and centered
                      automatically.
                    </b>
                  </p>
                  <DiagramEdit
                    contentModel={finalContentModel}
                    initialContentModelPosition={
                      contentTypePositionChanged
                        ? contentModelPosition
                        : initialContentModelPosition
                    }
                    onContentTypeDrag={onContentTypeDrag}
                  />
                  <footer className="flex justify-end mt-4 md:mt-8">
                    <Button
                      color="primary"
                      onClick={() => {
                        setViewError(null);
                        setViewStep('detailsInput');
                      }}
                    >
                      Continue
                    </Button>
                  </footer>
                </>
              ) : null}
            </div>
          </>
        ) : null}
        {viewStep === 'detailsInput' ? (
          <>
            {BackToImporting}
            {BackToAppearance}
            <div className="w-full max-w-xl mx-auto mt-6 md:mt-8">
              <h2 className="text-lg font-medium">
                You are doing great{' '}
                <FontAwesomeIcon
                  icon={['fal', 'sparkles']}
                  className="mr-1 text-yellow-500"
                />
                . In this final step, you can describe your content model to
                help others discover and understand it.
              </h2>
              <Details
                details={contentModelDetails}
                onChange={(details: DetailsData) => {
                  setContentModelDetails(details);
                }}
                onSubmit={(details: DetailsData) => {
                  onCreateContentModel(details);
                }}
                viewError={viewError}
                setViewError={setViewError}
              />
            </div>
          </>
        ) : null}
        {viewStep === 'success' && createdContentModelSlug !== undefined ? (
          <div className="w-full max-w-xl mx-auto mt-4 md:mt-8">
            <p className="text-base">
              <FontAwesomeIcon
                icon={['fal', 'sparkles']}
                className="mr-1 text-yellow-500"
              />
              <FontAwesomeIcon
                icon={['fal', 'sparkles']}
                className="mr-1 text-yellow-500"
              />
              <FontAwesomeIcon
                icon={['fal', 'sparkles']}
                className="mr-1 text-yellow-500"
              />{' '}
              You are awesome, and so is your content model. Why not share it
              with others now?
            </p>
            <p className="text-base mt-4 font-semibold">
              Share the url to your content model:
            </p>
            <input
              type="text"
              className={`mt-2 ${getInputClassName()}`}
              readOnly
              value={`${process.env.NEXT_PUBLIC_BASE_URL}/content-models/${createdContentModelSlug}`}
            />
            <div className="flex flex-wrap items-center justify-between mt-4">
              <p className="text-base mt-2 mr-2 font-semibold">
                Or check it out yourself:
              </p>
              <Link href={`/content-models/${createdContentModelSlug}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={getButtonClassName({
                    size: 's',
                    color: 'primary',
                    className: 'mt-2',
                  })}
                >
                  Go to content model
                </a>
              </Link>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
});

NewView.displayName = 'NewView';

export default NewView;
