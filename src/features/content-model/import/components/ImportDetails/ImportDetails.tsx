import React from 'react';
import { useForm } from 'react-hook-form';

import { ImportDetails as ImportDetailsData } from '@/src/features/content-model/import/types/spaceImport';
import Button from '@/src/shared/components/Button/Button';

interface ImportDetailsProps {
  importDetails: ImportDetailsData;
  setImportDetails: React.Dispatch<React.SetStateAction<ImportDetailsData>>;
  viewError: string | null;
  onBack: () => void;
  onImport: (details: ImportDetailsData) => void;
}

const ImportDetails: React.FC<ImportDetailsProps> = (props) => {
  const {
    importDetails,
    setImportDetails,
    viewError,
    onBack,
    onImport,
  } = props;

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: importDetails,
  });

  const onSubmit = (data: ImportDetailsData) => {
    setImportDetails(data);
    onImport(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="flex items-center">
        <p className="text-lg font-semibold order-2">Publish on import</p>
        <input
          name="publish"
          ref={register()}
          type="checkbox"
          className="border bg-white mr-2 p-2 text-gray-900 focus:outline-none focus:ring-2"
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
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700">{viewError}</p>
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
