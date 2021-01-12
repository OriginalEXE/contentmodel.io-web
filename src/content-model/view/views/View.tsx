import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { ParsedDbContentModel } from '@/src/content-model/types/parsedDbContentModel';
import DiagramViewSSRLoading from '@/src/diagram/components/DiagramView/DiagramViewSSRLoading';
import Header from '@/src/header/components/Header/Header';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import StyledDynamicContent from '@/src/shared/components/StyledDynamicContent/StyledDynamicContent';
import ProfileBadge from '@/src/user/components/ProfileBadge/ProfileBadge';
import { useStore } from '@/store/hooks';

const DiagramView = dynamic(
  () => import('@/src/diagram/components/DiagramView/DiagramView'),
  {
    ssr: false,
    loading: DiagramViewSSRLoading,
  },
);

interface ViewViewProps {
  contentModel: ParsedDbContentModel;
}

const ViewView: React.FC<ViewViewProps> = observer((props) => {
  const { contentModel } = props;

  const store = useStore();

  return (
    <>
      <Header />
      <main className="container mx-auto px-3 mb-4 xl:flex xl:mt-12 xl:mb-8">
        <div className="w-full max-w-xl mt-8 mx-auto flex-shrink-0 xl:w-72 xl:mt-2">
          <h1 className="text-2xl font-bold">{contentModel.title}</h1>
          {contentModel.description && (
            <StyledDynamicContent className="mt-2">
              {contentModel.description}
            </StyledDynamicContent>
          )}

          <div className="flex flex-wrap items-center mt-4">
            <p className="text-base font-semibold mr-4 mb-2">Shared by:</p>
            <ProfileBadge user={contentModel.user} className="mb-2" />
          </div>

          {store.me !== null && store.me.id === contentModel.user.id ? (
            <div>
              <Link href={`/content-models/${contentModel.slug}/edit`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={getButtonClassName({
                    size: 's',
                    color: 'primary',
                    className: 'mt-2',
                  })}
                >
                  Edit this content model
                </a>
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-4 w-full xl:mt-0">
          <DiagramView contentModel={contentModel} />
        </div>
      </main>
    </>
  );
});

ViewView.displayName = 'ViewView';

export default ViewView;
