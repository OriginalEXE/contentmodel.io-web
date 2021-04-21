import React from 'react';
import { useForm } from 'react-hook-form';

import ContentTypesSelection from '@/src/features/content-model/components/ContentTypesSelection/ContentTypesSelection';
import { ImportDetails as ImportDetailsData } from '@/src/features/content-model/import/types/spaceImport';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import Button from '@/src/shared/components/Button/Button';

interface ImportDetailsProps {
  chosenContentTypes?: string[];
  setChosenContentTypes: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  contentModel: ParsedDbContentModel;
  importDetails: ImportDetailsData;
  setImportDetails: React.Dispatch<React.SetStateAction<ImportDetailsData>>;
  viewError: string | null;
  onBack: () => void;
  onImport: ({
    details,
    chosenContentTypes,
  }: {
    details: ImportDetailsData;
    chosenContentTypes?: string[];
  }) => void;
}

const ImportDetails: React.FC<ImportDetailsProps> = (props) => {
  const {
    importDetails,
    setImportDetails,
    viewError,
    onBack,
    onImport,
    contentModel,
    chosenContentTypes,
    setChosenContentTypes,
  } = props;

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: importDetails,
  });

  const onSubmit = (data: ImportDetailsData) => {
    setImportDetails(data);
    onImport({ details: data, chosenContentTypes: chosenContentTypes });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="flex items-center">
        <p className="text-lg font-semibold order-2">Publish on import</p>
        <input
          {...register('publish')}
          type="checkbox"
          className="mr-2"
          onChange={() => {
            setImportDetails(getValues());
          }}
        />
      </label>
      <p className="text-base mt-2">
        By default, changes to your content model will be saved in a draft
        state. Check this box if you want to immediately publish the changes
        instead.
      </p>
      <h2 className="text-lg font-medium mt-8">
        Optionally, if you wish to exclude some content types, you can uncheck
        them below.
      </h2>
      <ContentTypesSelection
        contentModel={contentModel.model}
        defaultChosenContentTypes={chosenContentTypes}
        onChange={(newChosenContentTypes) => {
          setChosenContentTypes(newChosenContentTypes);
        }}
        className="mt-4"
      />
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700 dark:text-red-400">
          {viewError}
        </p>
      ) : null}
      <footer className="mt-8 flex justify-between">
        <Button
          variant="text"
          onClick={() => {
            onBack();
          }}
          className="mr-4"
        >
          Back
        </Button>
        <Button color="primary" type="submit">
          Import content model
        </Button>
      </footer>
    </form>
  );
};

export default ImportDetails;
