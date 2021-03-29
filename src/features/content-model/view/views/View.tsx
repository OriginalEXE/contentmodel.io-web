import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactText } from 'react';
import { useMutation } from 'react-query';
import { Item, useOverlayTriggerState } from 'react-stately';

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
import ToggleMenu from '@/src/shared/components/ToggleMenu/ToggleMenu';
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

          <div className="pt-2 flex flex-wrap">
            {store.me === null ? (
              <Link
                href={`/api/login?redirectTo=/content-models/${contentModel.slug}?importType`}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={getButtonClassName({
                    color: 'primary',
                    className: 'mt-2 mr-2',
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
                className="mt-2 mr-2"
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

            <ToggleMenu
              onAction={(key: ReactText) => {
                window.open(key as string, '_blank');
              }}
              aria-label="Menu"
              buttonClassName={getButtonClassName({
                color: 'clear',
                className: 'mt-2',
              })}
              buttonLabel="Profile menu"
              buttonRender={
                <>
                  <FontAwesomeIcon
                    icon={['fal', 'file-export']}
                    className="mr-2"
                  />{' '}
                  Export as ...
                </>
              }
            >
              {contentModel.image ? (
                <Item key={contentModel.image.src}>Image</Item>
              ) : null}
              {contentModel.imageNoConnections ? (
                <Item key={contentModel.imageNoConnections.src}>
                  Image (no connection lines)
                </Item>
              ) : null}
              <Item key={`/api/exportAsJSON?slug=${contentModel.slug}`}>
                JSON
              </Item>
            </ToggleMenu>
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
