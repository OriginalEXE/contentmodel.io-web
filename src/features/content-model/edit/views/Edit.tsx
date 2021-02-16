import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import * as z from 'zod';

const DiagramEdit = dynamic(
  () => import('@/src/features/diagram/components/DiagramEdit/DiagramEdit'),
  { ssr: false },
);

import updateContentModel from '@/src/features/content-model/api/updateContentModel';
import Details, {
  DetailsData,
} from '@/src/features/content-model/components/Details/Details';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import contentModelPositionSchema from '@/src/features/diagram/types/contentModelPosition';
import contentTypePositionSchema from '@/src/features/diagram/types/contentTypePosition';
import Footer from '@/src/features/footer/Footer';
import Header from '@/src/features/header/components/Header/Header';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type EditViewStep = 'appearanceInput' | 'detailsInput' | 'success';

interface EditViewProps {
  contentModel: ParsedDbContentModel;
}

const EditView: React.FC<EditViewProps> = observer((props) => {
  const { contentModel } = props;

  const [viewStep, setViewStep] = useState<EditViewStep>('detailsInput');
  const [viewError, setViewError] = useState<string | null>(null);

  // Diagram details
  const [contentModelPosition, setContentModelPosition] = useState<
    z.infer<typeof contentModelPositionSchema>
  >(contentModel.position);
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

  // Content model details
  const [contentModelDetails, setContentModelDetails] = useState<DetailsData>({
    title: contentModel.title,
    description: contentModel.description,
  });

  // Update content model
  const updateContentModelMutation = useMutation(updateContentModel, {
    onSuccess: () => {
      setViewStep('success');
    },
  });
  const onUpdateContentModel = (overrideContentModelDetails?: DetailsData) => {
    updateContentModelMutation.mutate({
      id: contentModel.id,
      title: overrideContentModelDetails?.title ?? contentModelDetails.title,
      description:
        overrideContentModelDetails?.description ??
        contentModelDetails.description,
      version: {
        model: JSON.stringify(contentModel.model),
        position: JSON.stringify(contentModelPosition),
      },
    });
  };

  const BackToImporting = (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center flex-wrap mt-4">
        <p className="text-base text-green-700 text-center mt-2">
          <FontAwesomeIcon icon={['fal', 'check']} className="mr-2" /> Content
          model successfully imported.{' '}
        </p>
      </div>
    </div>
  );

  const BackToAppearance = (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center flex-wrap mt-4">
        <p className="text-base text-green-700 text-center mt-2">
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
            Edit your content model
          </h1>
        </div>
        {viewStep === 'appearanceInput' ? (
          <>
            {BackToImporting}
            <div className="w-full max-w-xl mx-auto">
              <p className="text-base mt-6 md:mt-8">
                On the diagram below, arrange your content types as you would
                like for them to be shown to others. Note that the zoom level is
                not important/saved, and neither is the global position of
                content types, only their relationship matters.{' '}
                <b>
                  The view itself will always be zoomed in and centered
                  automatically.
                </b>
              </p>
            </div>
            <div className="w-full">
              <DiagramEdit
                contentModel={contentModel.model}
                initialContentModelPosition={
                  contentTypePositionChanged
                    ? contentModelPosition
                    : contentModel.position
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
            </div>
          </>
        ) : null}
        {viewStep === 'detailsInput' ? (
          <>
            {BackToImporting}
            {BackToAppearance}
            <div className="w-full max-w-xl mx-auto mt-6 md:mt-8">
              <h2 className="text-lg font-medium">
                Describe your content model to help others discover and
                understand it.
              </h2>
              <Details
                details={contentModelDetails}
                onChange={(details: DetailsData) => {
                  setContentModelDetails(details);
                }}
                onSubmit={(details: DetailsData) => {
                  onUpdateContentModel(details);
                }}
                viewError={viewError}
                setViewError={setViewError}
              />
            </div>
          </>
        ) : null}
        {viewStep === 'success' ? (
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
              className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
              readOnly
              value={`${process.env.NEXT_PUBLIC_BASE_URL}/content-models/${contentModel.slug}`}
            />
            <div className="flex flex-wrap items-center justify-between mt-4">
              <p className="text-base mt-2 mr-2 font-semibold">
                Or check it out yourself:
              </p>
              <Link href={`/content-models/${contentModel.slug}`}>
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

EditView.displayName = 'EditView';

export default EditView;
