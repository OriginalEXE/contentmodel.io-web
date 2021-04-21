import { useForm } from 'react-hook-form';

import { SpaceImportData } from '@/src/features/content-model/new/types/spaceImport';
import Button from '@/src/shared/components/Button/Button';
import { getInputClassName } from '@/src/shared/components/Input/getInputClassName';

interface ManualImportProps {
  spaceImportDetails: SpaceImportData;
  setSpaceImportDetails: React.Dispatch<React.SetStateAction<SpaceImportData>>;
  onChange: (value: string) => void;
  validateContentModel: (contentModelText: string) => void;
  viewError: string | null;
  setViewError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ManualImport: React.FC<ManualImportProps> = (props) => {
  const {
    onChange,
    validateContentModel,
    viewError,
    setViewError,
    spaceImportDetails,
    setSpaceImportDetails,
  } = props;

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: spaceImportDetails,
  });

  const onSubmit = async (data: SpaceImportData) => {
    setSpaceImportDetails(data);

    const response = await fetch(
      `https://api.contentful.com/spaces/${data.spaceId}/environments/${
        data.environmentId === '' ? 'master' : data.environmentId
      }/content_types?access_token=${data.token}`,
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
          {...register('spaceId', { required: true })}
          type="text"
          className={`mt-2 ${getInputClassName()}`}
        />
      </label>
      {errors.spaceId ? (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          Space ID is required
        </p>
      ) : null}
      <label className="block mt-4">
        <p className="text-lg font-semibold">Management Token</p>
        <input
          {...register('token', { required: true })}
          type="password"
          className={`mt-2 ${getInputClassName()}`}
        />
      </label>
      {errors.token ? (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          Management Token is required
        </p>
      ) : null}
      <p className="text-sm mt-2">
        The management token is never passed to our servers. It is required
        because the Delivery API does not return field validations for reference
        fields. We use it for read access only. If possible, we recommend using
        the &quot;Pull from Contentful&quot; method instead as it uses read-only
        tokens instead.
      </p>
      <label className="block mt-4">
        <p className="text-lg font-semibold">Environment ID (optional)</p>
        <input
          {...register('environmentId')}
          type="text"
          className={`mt-2 ${getInputClassName()}`}
        />
      </label>
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700 dark:text-red-400">
          {viewError}
        </p>
      ) : null}
      <footer className="mt-8 flex justify-end">
        <Button color="primary" type="submit">
          Import content model
        </Button>
      </footer>
    </form>
  );
};

export default ManualImport;
