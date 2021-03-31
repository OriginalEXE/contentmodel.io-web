import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactText, RefObject, useState } from 'react';
import { useMutation } from 'react-query';
import { Item, useOverlayTriggerState } from 'react-stately';

import deleteContentModel from '@/src/features/content-model/api/deleteContentModel';
import starContentModel from '@/src/features/content-model/api/starContentModel';
import unstarContentModel from '@/src/features/content-model/api/unstarContentModel';
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
import Tooltip from '@/src/shared/components/Tooltip/Tooltip';
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

  // (Un)Starring the content model
  const [starsCount, setStarsCount] = useState(contentModel.stars);
  const [isStarred, setIsStarred] = useState(contentModel.starred);

  const starContentModelMutation = useMutation(starContentModel, {
    onMutate: () => {
      setStarsCount((x) => (x += 1));
      setIsStarred(true);
    },
  });

  const unstarContentModelMutation = useMutation(unstarContentModel, {
    onMutate: () => {
      setStarsCount((x) => (x -= 1));
      setIsStarred(false);
    },
  });

  const contentModelActions = () => {
    return (
      <div className="pt-2 flex flex-wrap items-start xl:pt-0">
        {store.me === null ? (
          <Link
            href={`/api/login?redirectTo=/content-models/${contentModel.slug}?importType`}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              className={getButtonClassName({
                color: 'clear',
                className: 'mt-2 mr-2',
                size: 's',
              })}
            >
              <FontAwesomeIcon icon={['fal', 'file-import']} className="mr-2" />{' '}
              Import to Contentful
            </a>
          </Link>
        ) : (
          <Button
            color="clear"
            onClick={() => {
              importContentModelOverlayState.open();
            }}
            className="mt-2 mr-2"
            size="s"
          >
            <FontAwesomeIcon icon={['fal', 'file-import']} className="mr-2" />{' '}
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
            className: 'mt-2 mr-2',
            size: 's',
          })}
          buttonLabel="Profile menu"
          buttonRender={
            <>
              <FontAwesomeIcon icon={['fal', 'file-export']} className="mr-2" />{' '}
              Export as ...
            </>
          }
          dropdownAlign="left"
        >
          {contentModel.image ? (
            <Item key={contentModel.image.src}>Image</Item>
          ) : null}
          {contentModel.imageNoConnections ? (
            <Item key={contentModel.imageNoConnections.src}>
              Image (no connection lines)
            </Item>
          ) : null}
          <Item key={`/api/exportAsJSON?slug=${contentModel.slug}`}>JSON</Item>
        </ToggleMenu>

        <div className="relative sm:ml-auto">
          <Tooltip tooltip={isStarred ? 'Unstar' : 'Star'}>
            {(ref, props) => (
              <Button
                color="clear"
                className="mt-2 ml-auto"
                size="s"
                ref={ref as RefObject<HTMLButtonElement>}
                htmlAttributes={props}
                onClick={() => {
                  if (store.me === null) {
                    router.push(
                      `/api/login?redirectTo=/content-models/${contentModel.slug}`,
                    );
                    return;
                  }

                  isStarred === true
                    ? unstarContentModelMutation.mutate({
                        id: contentModel.id,
                      })
                    : starContentModelMutation.mutate({ id: contentModel.id });
                }}
              >
                <div className="inline-block relative">
                  <FontAwesomeIcon
                    icon={['fas', 'star']}
                    className={`left-0 top-1/2 transform -translate-y-1/2 absolute transition-all ease-in-out duration-75 ${
                      isStarred === true
                        ? 'opacity-100 scale-100 delay-75'
                        : 'opacity-0 scale-150'
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={['fal', 'star']}
                    className={`mr-2 transform transition-all ease-in-out duration-75 ${
                      isStarred === true
                        ? 'opacity-0 scale-50'
                        : 'opacity-100 scale-100'
                    }`}
                  />
                </div>{' '}
                {starsCount}
              </Button>
            )}
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 mb-8 mt-12">
        <div className="w-full max-w-xl mx-auto flex-shrink-0">
          <h1 className="text-2xl font-bold">{contentModel.title}</h1>

          <div className="flex flex-wrap items-center mt-2">
            <ProfileBadge user={contentModel.user} className="mb-4" />
          </div>

          {contentModelActions()}
        </div>

        <div className="mt-4 w-full md:mt-8 xl:mt-0">
          <DiagramView contentModel={contentModel} className="xl:mt-8" />
        </div>

        {contentModel.description && (
          <StyledDynamicContent className="mt-8 mx-auto max-w-xl break-words xl:mt-12">
            {contentModel.description}
          </StyledDynamicContent>
        )}

        {store.me !== null && store.me.id === contentModel.user.id ? (
          <div className="flex flex-wrap items-center mx-auto max-w-xl border-t pt-2 mt-8">
            <Link href={`/content-models/${contentModel.slug}/edit`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className={getButtonClassName({
                  className: 'mt-2',
                  variant: 'text',
                  size: 's',
                })}
              >
                Edit
              </a>
            </Link>
            <Button
              color="danger"
              variant="text"
              className="mt-2 ml-4"
              size="s"
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
      </main>
      <Footer />
    </>
  );
});

ViewView.displayName = 'ViewView';

export default ViewView;
