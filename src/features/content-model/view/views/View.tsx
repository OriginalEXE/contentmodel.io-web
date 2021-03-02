import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';
import { useOverlayTriggerState } from 'react-stately';

import deleteContentModel from '@/src/features/content-model/api/deleteContentModel';
import ImportView from '@/src/features/content-model/import/views/Import';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import DiagramViewSSRLoading from '@/src/features/diagram/components/DiagramView/DiagramViewSSRLoading';
import Footer from '@/src/features/footer/Footer';
import Header from '@/src/features/header/components/Header/Header';
import ProfileBadge from '@/src/features/user/components/ProfileBadge/ProfileBadge';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import StyledDynamicContent from '@/src/shared/components/StyledDynamicContent/StyledDynamicContent';
import { useStore } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DiagramView = dynamic(
  () => import('@/src/features/diagram/components/DiagramView/DiagramView'),
  {
    ssr: false,
    loading: DiagramViewSSRLoading,
  },
);

const ModalDialog = dynamic(
  () => import('@/src/shared/components/ModalDialog/ModalDialog'),
  {
    ssr: false,
  },
);

interface ViewViewProps {
  contentModel: ParsedDbContentModel;
}

const ViewView: React.FC<ViewViewProps> = observer((props) => {
  const { contentModel } = props;

  const store = useStore();
  const router = useRouter();

  const deleteContentModelOverlayState = useOverlayTriggerState({});

  const importContentModelOverlayState = useOverlayTriggerState({
    defaultOpen: router.query.importType !== undefined,
  });

  const deleteContentModelMutation = useMutation(deleteContentModel);

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 mb-8 xl:flex xl:mt-12">
        <div className="w-full max-w-xl mt-8 mx-auto flex-shrink-0 xl:w-84 xl:mr-4">
          <h1 className="text-2xl font-bold">{contentModel.title}</h1>
          {contentModel.description && (
            <StyledDynamicContent className="mt-2 break-words">
              {contentModel.description}
            </StyledDynamicContent>
          )}

          <div className="flex flex-wrap items-center mt-4">
            <p className="text-base font-semibold mr-4 mb-2">Shared by:</p>
            <ProfileBadge user={contentModel.user} className="mb-2" />
          </div>

          <div className="mt-4">
            {store.me === null ? (
              <Link
                href={`/api/login?redirectTo=/content-models/${contentModel.slug}?importType`}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={getButtonClassName({
                    color: 'primary',
                  })}
                >
                  <FontAwesomeIcon
                    icon={['fal', 'file-import']}
                    className="mr-2"
                  />{' '}
                  Import to Contentful
                </a>
              </Link>
            ) : (
              <Button
                color="primary"
                onClick={() => {
                  importContentModelOverlayState.open();
                }}
              >
                <FontAwesomeIcon
                  icon={['fal', 'file-import']}
                  className="mr-2"
                />{' '}
                Import to Contentful
              </Button>
            )}

            {importContentModelOverlayState.isOpen ? (
              <ModalDialog
                title={`Import "${contentModel.title}"`}
                isDismissable
                isOpen
                onClose={importContentModelOverlayState.close}
              >
                <ImportView
                  contentModel={contentModel}
                  onClose={importContentModelOverlayState.close}
                />
              </ModalDialog>
            ) : null}
          </div>

          {store.me !== null && store.me.id === contentModel.user.id ? (
            <div className="flex flex-wrap items-center">
              <Link href={`/content-models/${contentModel.slug}/edit`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={getButtonClassName({
                    size: 's',
                    className: 'mt-2',
                  })}
                >
                  Edit
                </a>
              </Link>
              <Button
                color="danger"
                variant="text"
                className="mt-2 ml-4"
                onClick={() => {
                  deleteContentModelOverlayState.open();
                }}
              >
                Delete
              </Button>
              {deleteContentModelOverlayState.isOpen ? (
                <ModalDialog
                  title={`Delete "${contentModel.title}"?`}
                  isDismissable
                  isOpen
                  onClose={deleteContentModelOverlayState.close}
                >
                  <p>This action can&apos;t be undone.</p>
                  <div className="flex flex-wrap mt-6">
                    <Button
                      grow={false}
                      className="mt-2"
                      onClick={() => {
                        deleteContentModelOverlayState.close();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="danger"
                      grow={false}
                      className="mt-2 ml-4"
                      onClick={() => {
                        deleteContentModelMutation.mutate({
                          id: contentModel.id,
                        });

                        router.push('/profile/content-models');
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </ModalDialog>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-4 w-full md:mt-8 xl:mt-0">
          <DiagramView contentModel={contentModel} />
        </div>
      </main>
      <Footer />
    </>
  );
});

ViewView.displayName = 'ViewView';

export default ViewView;
