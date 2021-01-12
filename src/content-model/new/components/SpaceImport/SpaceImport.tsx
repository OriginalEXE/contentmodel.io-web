import { useForm } from 'react-hook-form';

import Button from '@/src/shared/components/Button/Button';

export interface SpaceImportData {
  spaceId: string;
  apiKey: string;
}

interface SpaceImport {
  spaceImportDetails: SpaceImportData;
  setSpaceImportDetails: React.Dispatch<React.SetStateAction<SpaceImportData>>;
  onChange: (value: string) => void;
  validateContentModel: (contentModelText: string) => void;
  viewError: string | null;
  setViewError: React.Dispatch<React.SetStateAction<string | null>>;
}

const SpaceImport: React.FC<SpaceImport> = (props) => {
  const {
    onChange,
    validateContentModel,
    viewError,
    setViewError,
    spaceImportDetails,
    setSpaceImportDetails,
  } = props;

  const { register, handleSubmit, errors } = useForm({
    defaultValues: spaceImportDetails,
  });

  const onSubmit = async (data: SpaceImportData) => {
    setSpaceImportDetails(data);

    const response = await fetch(
      `https://api.contentful.com/spaces/${data.spaceId}/environments/master/content_types?access_token=${data.apiKey}`,
    );

    if (response.ok === false) {
      setViewError(
        'Could not fetch the content model from the API. Check that you have provided the correct details.',
      );
      return;
    }

    const responseBody = await response.text();

    onChange(responseBody);

    validateContentModel(responseBody);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
      <label className="block">
        <p className="text-lg font-semibold">Space ID</p>
        <input
          name="spaceId"
          ref={register({ required: true })}
          type="text"
          className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
        />
      </label>
      {errors.spaceId ? (
        <p className="mt-2 text-sm text-red-700">Space ID is required</p>
      ) : null}
      <label className="block mt-4">
        <p className="text-lg font-semibold">Management Token</p>
        <input
          name="apiKey"
          ref={register({ required: true })}
          type="password"
          className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
        />
      </label>
      {errors.apiKey ? (
        <p className="mt-2 text-sm text-red-700">
          Management Token is required
        </p>
      ) : null}
      <p className="text-sm mt-2">
        The management token is never passed to our servers. It is required
        because the Delivery API does not return field validations for reference
        fields. We use it for read access only. If you are not comfortable with
        this, we suggest using the Copy/paste method instead.
      </p>
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700">{viewError}</p>
      ) : null}
      <footer className="mt-8 flex justify-end">
        <Button color="primary" type="submit">
          Import content model
        </Button>
      </footer>
    </form>
  );
};

export default SpaceImport;
