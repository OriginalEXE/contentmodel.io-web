import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import * as z from 'zod';

const DiagramEdit = dynamic(
  () => import('@/src/content-model/components/DiagramEdit/DiagramEdit'),
  { ssr: false },
);

import createContentModel from '@/src/content-model/api/createContentModel';
import Details, {
  DetailsData,
} from '@/src/content-model/components/Details/Details';
import ImportChoice, {
  ImportTypeChoices,
} from '@/src/content-model/new/components/ImportChoice/ImportChoice';
import JSONInput from '@/src/content-model/new/components/JSONInput/JSONInput';
import SpaceImport, {
  SpaceImportData,
} from '@/src/content-model/new/components/SpaceImport/SpaceImport';
import parseContentModel from '@/src/content-model/parsing/parseContentModel';
import contentModelSchema from '@/src/content-model/types/contentModel';
import addAssetToContentModel from '@/src/content-model/utilities/addAssetToContentModel';
import contentModelPositionSchema from '@/src/diagram/types/contentModelPosition';
import contentTypePositionSchema from '@/src/diagram/types/contentTypePosition';
import Header from '@/src/header/components/Header/Header';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type NewViewStep =
  | 'contentModelInput'
  | 'appearanceInput'
  | 'detailsInput'
  | 'success';

const NewView: React.FC = observer(() => {
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
  const [importType, setImportType] = useState<ImportTypeChoices | undefined>();

  // We preserver space id + delivery API key temporarily in case they go back
  const [spaceImportDetails, setSpaceImportDetails] = useState<SpaceImportData>(
    {
      spaceId: '',
      apiKey: '',
    },
  );

  const [contentModelJSONText, setContentModelJSONText] = useState('');
  const [parsedContentModel, setParsedContentModel] = useState<
    z.infer<typeof contentModelSchema>
  >();
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
    const startingContentModelPosition = {
      contentTypes: contentModel.reduce((prev, current, i) => {
        return {
          ...prev,
          [current.sys.id]: {
            x: i * 420,
            y: 0,
          },
        };
      }, {}),
    };

    setInitialContentModelPosition(startingContentModelPosition);
    setContentModelPosition(startingContentModelPosition);
    setParsedContentModel(contentModel);
    setViewError(null);
    setViewStep('appearanceInput');
  };

  // Content model details
  const [contentModelDetails, setContentModelDetails] = useState<DetailsData>({
    title: '',
    description: '',
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
      version: {
        model: JSON.stringify(parsedContentModel),
        position: JSON.stringify(contentModelPosition),
      },
    });
  };

  const BackToImporting = (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center flex-wrap mt-4">
        <p className="text-base text-green-700 text-center mt-2">
          <FontAwesomeIcon icon={['fas', 'check']} className="mr-2" /> Content
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
        <p className="text-base text-green-700 text-center mt-2">
          <FontAwesomeIcon icon={['fas', 'check']} className="mr-2" /> Content
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
      <main className="container mx-auto px-3 pb-4">
        <div className="w-full max-w-xl mt-12 mx-auto">
          <h1 className="text-2xl font-bold text-center md:text-4xl">
            Share your content model
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
                <SpaceImport
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
            </>
          ) : null}
        </div>
        {viewStep === 'appearanceInput' ? (
          <>
            {BackToImporting}
            <div className="w-full">
              {parsedContentModel !== undefined ? (
                <>
                  <p className="text-base mt-6 md:mt-8">
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
                    contentModel={parsedContentModel}
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
                  icon={['fas', 'sparkles']}
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
                icon={['fas', 'sparkles']}
                className="mr-1 text-yellow-500"
              />
              <FontAwesomeIcon
                icon={['fas', 'sparkles']}
                className="mr-1 text-yellow-500"
              />
              <FontAwesomeIcon
                icon={['fas', 'sparkles']}
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
              className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
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
    </>
  );
});

NewView.displayName = 'NewView';

export default NewView;
