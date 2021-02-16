import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import DiagramViewSSRLoading from '@/src/features/diagram/components/DiagramView/DiagramViewSSRLoading';
import ProfileBadge from '@/src/features/user/components/ProfileBadge/ProfileBadge';
import logo from '@/src/shared/assets/logo/logo.svg';

import styles from './PreviewImage.module.css';

const DiagramView = dynamic(
  () => import('@/src/features/diagram/components/DiagramView/DiagramView'),
  {
    ssr: false,
    loading: DiagramViewSSRLoading,
  },
);

interface PreviewImageViewProps {
  contentModel: ParsedDbContentModel;
}

const PreviewImageView: React.FC<PreviewImageViewProps> = observer((props) => {
  const { contentModel } = props;

  const router = useRouter();

  const showBranding = router.query.showBranding === '0' ? false : true;

  return (
    <main className="relative">
      <div className="opacity-30">
        <DiagramView
          contentModel={contentModel}
          fillViewport
          showControls={false}
          animatedAppearance={false}
        />
      </div>
      <div className="absolute top-8 left-8 right-8">
        <h1
          className={`text-7xl font-bold mb-12 w-10/12 leading-tight ${styles.title}`}
        >
          {contentModel.title}
        </h1>
        <ProfileBadge
          user={contentModel.user}
          avatarClassName="w-24 mr-6"
          nameClassName="text-5xl"
        />
      </div>
      {showBranding === true ? (
        <div className="absolute bottom-8 right-8 z-50">
          <img src={logo} alt="ContentModel.io logo" width="500" />
        </div>
      ) : (
        false
      )}
    </main>
  );
});

PreviewImageView.displayName = 'PreviewImageView';

export default PreviewImageView;
