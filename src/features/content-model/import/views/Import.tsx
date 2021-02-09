import catchify from 'catchify';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import importContentModelToContentful from '@/src/features/content-model/api/importContentModelToContentful';
import ImportChoice, {
  ImportTypeChoices,
  importTypeChoiceSchema,
} from '@/src/features/content-model/import/components/ImportChoice/ImportChoice';
import ImportDetails from '@/src/features/content-model/import/components/ImportDetails/ImportDetails';
import ManualImport from '@/src/features/content-model/import/components/ManualImport/ManualImport';
import OAuthImport from '@/src/features/content-model/import/components/OAuthImport/OAuthImport';
import { CONTENT_MODEL_LAST_IMPORT_SLUG_KEY } from '@/src/features/content-model/import/constants';
import { SpaceImportData } from '@/src/features/content-model/import/types/spaceImport';
import { ImportDetails as ImportDetailsData } from '@/src/features/content-model/import/types/spaceImport';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ImportViewStep = 'importChoice' | 'detailsInput' | 'success';

interface ImportViewProps {
  contentModel: ParsedDbContentModel;
  onClose: () => void;
}

const ImportView: React.FC<ImportViewProps> = observer((props) => {
  const { contentModel, onClose } = props;

  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem(
      CONTENT_MODEL_LAST_IMPORT_SLUG_KEY,
      contentModel.slug,
    );
  }, [contentModel.slug]);

  const [viewStep, setViewStep] = useState<ImportViewStep>('importChoice');
  const [viewError, setViewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [spaceImportDetails, setSpaceImportDetails] = useState<SpaceImportData>(
    {
      spaceId: '',
      token: '',
      environmentId: '',
    },
  );

  const [importDetails, setImportDetails] = useState<ImportDetailsData>({
    publish: false,
  });

  const onImportChoiceConfirm = useCallback(() => {
    setViewError(null);
    setViewStep('detailsInput');
  }, []);

  const [chosenContentTypes, setChosenContentTypes] = useState<string[]>();

  const onImport = useCallback(
    ({
      details,
      chosenContentTypes: finalChosenContentTypes,
    }: {
      details: ImportDetailsData;
      chosenContentTypes?: string[];
    }) => {
      (async () => {
        if (
          Array.isArray(finalChosenContentTypes) &&
          finalChosenContentTypes.length === 0
        ) {
          setViewError('At least one content type has to be selected.');
          return;
        }

        setViewError(null);
        setIsLoading(true);

        const [importToContentfulError, importToContentful] = await catchify(
          importContentModelToContentful({
            ...spaceImportDetails,
            contentTypes: finalChosenContentTypes,
            slug: contentModel.slug,
            publish: details.publish,
          }),
        );

        setIsLoading(false);

        if (importToContentfulError !== null) {
          setViewError(
            'Something went wrong, please try again or reach out to us at hello@contentmodel.io',
          );
          return;
        }

        if (importToContentful.error !== undefined) {
          setViewError(importToContentful.error);
          return;
        }

        setViewStep('success');
      })();
    },
    [contentModel.slug, spaceImportDetails],
  );

  return (
    <>
      {viewStep === 'importChoice' ? (
        <>
          <ImportChoice
            defaultValue={importType}
            onChoice={(choice) => {
              setViewError(null);
              setImportType(choice);
            }}
          />
          {importType === 'oauth' ? (
            <OAuthImport
              oauthImportDetails={spaceImportDetails}
              setOAuthImportDetails={setSpaceImportDetails}
              viewError={viewError}
              setViewError={setViewError}
              setIsLoading={setIsLoading}
              onNextStep={onImportChoiceConfirm}
            />
          ) : null}
          {importType === 'manual' ? (
            <ManualImport
              spaceImportDetails={spaceImportDetails}
              setSpaceImportDetails={setSpaceImportDetails}
              viewError={viewError}
              setViewError={setViewError}
              setIsLoading={setIsLoading}
              onNextStep={onImportChoiceConfirm}
            />
          ) : null}
        </>
      ) : null}
      {viewStep === 'detailsInput' ? (
        <ImportDetails
          importDetails={importDetails}
          setImportDetails={setImportDetails}
          onBack={() => {
            setViewStep('importChoice');
          }}
          onImport={onImport}
          viewError={viewError}
          chosenContentTypes={chosenContentTypes}
          setChosenContentTypes={setChosenContentTypes}
          contentModel={contentModel}
        />
      ) : null}
      {viewStep === 'success' ? (
        <>
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
            We have successfully imported the content model into your Contentful
            space.
          </p>
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="text"
              onClick={() => {
                onClose();
              }}
              className="mr-4"
            >
              Close
            </Button>
            <a
              href={
                spaceImportDetails.environmentId === ''
                  ? `https://app.contentful.com/spaces/${spaceImportDetails.spaceId}/content_types`
                  : `https://app.contentful.com/spaces/${spaceImportDetails.spaceId}/environments/${spaceImportDetails.environmentId}/content_types`
              }
              className={getButtonClassName({
                color: 'primary',
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={['fal', 'external-link']}
                className="mr-2"
              />{' '}
              Check it out
            </a>
          </div>
        </>
      ) : null}
      {isLoading === true ? (
        <div className="flex items-center justify-center absolute z-40 w-full h-full top-0 left-0 bg-sepia-300 bg-opacity-80 text-seagreen-500">
          <FontAwesomeIcon icon={['fal', 'spinner-third']} size="5x" spin />
        </div>
      ) : null}
    </>
  );
});

ImportView.displayName = 'ImportView';

export default ImportView;
