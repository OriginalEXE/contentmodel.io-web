import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import DiagramViewSSRLoading from '@/src/features/diagram/components/DiagramView/DiagramViewSSRLoading';

const DiagramView = dynamic(
  () => import('@/src/features/diagram/components/DiagramView/DiagramView'),
  {
    ssr: false,
    loading: DiagramViewSSRLoading,
  },
);

interface EmbedViewProps {
  contentModel: ParsedDbContentModel;
}

const EmbedView: React.FC<EmbedViewProps> = observer((props) => {
  const { contentModel } = props;

  const router = useRouter();

  const showControls = router.query.showControls === '0' ? false : true;
  const animatedAppearance =
    router.query.animatedAppearance === '0' ? false : true;
  const drawConnections = router.query.drawConnections === '0' ? false : true;

  return (
    <DiagramView
      contentModel={contentModel}
      fillViewport
      showControls={showControls}
      animatedAppearance={animatedAppearance}
      drawConnections={drawConnections}
    />
  );
});

EmbedView.displayName = 'EmbedView';

export default EmbedView;
