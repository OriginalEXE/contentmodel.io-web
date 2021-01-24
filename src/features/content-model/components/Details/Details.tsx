import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/src/shared/components/Button/Button';
import StyledDynamicContent from '@/src/shared/components/StyledDynamicContent/StyledDynamicContent';

export interface DetailsData {
  title: string;
  description: string;
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

  const { register, handleSubmit, errors, watch } = useForm({
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
          name="title"
          ref={register({ required: true })}
          type="text"
          className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
        />
      </label>
      {errors.title ? (
        <p className="mt-2 text-sm text-red-700">Title is required</p>
      ) : null}
      <label className="block mt-4">
        <p className="text-lg font-semibold flex justify-between">
          Description
          <Button
            size="s"
            grow={false}
            className="ml-1"
            onClick={() => {
              setDescriptionPreview((preview) => !preview);
            }}
          >
            {descriptionPreview ? 'Editor' : 'Preview'}
          </Button>
        </p>
        <textarea
          name="description"
          ref={register({ required: true })}
          rows={8}
          className={`mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2
              ${descriptionPreview ? 'hidden' : ''}
            `}
        />
        {descriptionPreview ? (
          <StyledDynamicContent className="mt-2 p-2 rounded-lg border bg-white text-gray-900">
            {watch('description')}
          </StyledDynamicContent>
        ) : null}
        <p className="text-sm mt-2">
          <a
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
          >
            Markdown
          </a>{' '}
          supported
        </p>
      </label>
      {errors.description ? (
        <p className="mt-2 text-sm text-red-700">Description is required</p>
      ) : null}
      {viewError !== null ? (
        <p className="mt-4 text-base text-red-700">{viewError}</p>
      ) : null}
      <footer className="mt-8 flex justify-end">
        <Button color="primary" type="submit">
          Save and publish
        </Button>
      </footer>
    </form>
  );
};

export default Details;
