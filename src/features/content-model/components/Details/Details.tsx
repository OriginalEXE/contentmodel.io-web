import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/src/shared/components/Button/Button';
import { getInputClassName } from '@/src/shared/components/Input/getInputClassName';
import StyledDynamicContent from '@/src/shared/components/StyledDynamicContent/StyledDynamicContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface DetailsData {
  title: string;
  description: string;
  visibility: string;
}

interface DetailsProps {
  details: DetailsData;
  onChange: (details: DetailsData) => void;
  onSubmit: (details: DetailsData) => void;
  viewError: string | null;
  setViewError: React.Dispatch<React.SetStateAction<string | null>>;
}

const Details: React.FC<DetailsProps> = (props) => {
  const { details, onChange, onSubmit, viewError } = props;

  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm({
    defaultValues: details,
  });

  const onDetailsSubmit = async (data: DetailsData) => {
    onChange(data);
    onSubmit(data);
  };

  const [descriptionPreview, setDescriptionPreview] = useState(false);

  return (
    <form onSubmit={handleSubmit(onDetailsSubmit)} className="mt-8">
      <label className="block">
        <p className="text-lg font-semibold">Title</p>
        <input
          {...register('title', { required: true })}
          type="text"
          className={`mt-2 ${getInputClassName()}`}
        />
      </label>
      {errors.title ? (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          Title is required
        </p>
      ) : null}
      <label className="block mt-4 relative">
        <p className="text-lg font-semibold flex justify-between">
          Description
        </p>
        <textarea
          {...register('description', { required: true })}
          rows={8}
          className={`mt-2 ${getInputClassName({ type: 'textarea' })}
              ${descriptionPreview ? 'hidden' : ''}
            `}
        />
        <Button
          size="s"
          grow={false}
          className="absolute top-0 right-0"
          onClick={() => {
            setDescriptionPreview((preview) => !preview);
          }}
        >
          {descriptionPreview ? 'Editor' : 'Preview'}
        </Button>
        {descriptionPreview ? (
          <StyledDynamicContent className="mt-2 p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {watch('description')}
          </StyledDynamicContent>
        ) : null}
        <p className="text-sm mt-2">
          <a
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 dark:text-blue-400 hover:underline focus:underline"
          >
            Markdown <FontAwesomeIcon icon={['fal', 'external-link']} />
          </a>{' '}
          supported
        </p>
      </label>
      {errors.description ? (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          Description is required
        </p>
      ) : null}
      <div className="mt-4">
        <p className="text-lg font-semibold">Visibility</p>
        <div className="p-2 border dark:border-gray-500 rounded-lg mt-2">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-6 h-6">
              <input
                {...register('visibility', { required: true })}
                id="visibility-public"
                type="radio"
                value="PUBLIC"
              />
            </div>
            <label htmlFor="visibility-public" className="block ml-1 w-full">
              <p className="text-base font-semibold">
                <FontAwesomeIcon
                  icon={['fal', 'users']}
                  fixedWidth
                  className="mr-1"
                />{' '}
                Public
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Listed in the public library, visible by anyone
              </p>
            </label>
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center justify-center w-6 h-6">
              <input
                {...register('visibility', { required: true })}
                id="visibility-unlisted"
                type="radio"
                value="UNLISTED"
              />
            </div>
            <label htmlFor="visibility-unlisted" className="block ml-1 w-full">
              <p className="text-base font-semibold">
                <FontAwesomeIcon
                  icon={['fal', 'eye-slash']}
                  fixedWidth
                  className="mr-1"
                />{' '}
                Unlisted
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Not listed in the public library, visible by anyone who has a
                link
              </p>
            </label>
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center justify-center w-6 h-6">
              <input
                {...register('visibility', { required: true })}
                id="visibility-private"
                type="radio"
                value="PRIVATE"
              />
            </div>
            <label htmlFor="visibility-private" className="block ml-1 w-full">
              <p className="text-base font-semibold">
                <FontAwesomeIcon
                  icon={['fal', 'lock']}
                  fixedWidth
                  className="mr-1"
                />{' '}
                Private
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Visible only to you
              </p>
            </label>
          </div>
        </div>
      </div>
      {errors.visibility ? (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          Visibility is required
        </p>
      ) : null}
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700 dark:text-red-400">
          {viewError}
        </p>
      ) : null}
      <footer className="mt-8 flex justify-end">
        <Button color="primary" type="submit">
          Save and visualize
        </Button>
      </footer>
    </form>
  );
};

export default Details;
