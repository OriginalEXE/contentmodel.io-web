import { useForm } from 'react-hook-form';

import { SpaceImportData } from '@/src/features/content-model/import/types/spaceImport';
import Button from '@/src/shared/components/Button/Button';

interface SpaceImport {
  spaceImportDetails: SpaceImportData;
  setSpaceImportDetails: React.Dispatch<React.SetStateAction<SpaceImportData>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  viewError: string | null;
  setViewError: React.Dispatch<React.SetStateAction<string | null>>;
  onNextStep: () => void;
}

const SpaceImport: React.FC<SpaceImport> = (props) => {
  const {
    viewError,
    setViewError,
    spaceImportDetails,
    setSpaceImportDetails,
    setIsLoading,
    onNextStep,
  } = props;

  const { register, handleSubmit, errors } = useForm({
    defaultValues: spaceImportDetails,
  });

  const onSubmit = async (data: SpaceImportData) => {
    setIsLoading(true);

    const response = await fetch(
      `https://api.contentful.com/spaces/${data.spaceId}/environments/master/content_types?access_token=${data.token}`,
    );

    setIsLoading(false);

    if (response.ok === false) {
      setViewError(
        'Could not validate the connection to Contentful, check that you have entered correct details.',
      );
      return;
    }

    setSpaceImportDetails(data);
    onNextStep();
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
          name="token"
          ref={register({ required: true })}
          type="password"
          className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
        />
      </label>
      {errors.token ? (
        <p className="mt-2 text-sm text-red-700">
          Management Token is required
        </p>
      ) : null}
      <p className="text-sm mt-2">
        The management token is persisted for your current browsing session
        only.
      </p>
      <label className="block mt-4">
        <p className="text-lg font-semibold">Environment ID (optional)</p>
        <input
          name="environmentId"
          ref={register()}
          type="text"
          className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
        />
      </label>
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700">{viewError}</p>
      ) : null}
      <footer className="mt-8 flex justify-end">
        <Button color="primary" type="submit">
          Next step
        </Button>
      </footer>
    </form>
  );
};

export default SpaceImport;
