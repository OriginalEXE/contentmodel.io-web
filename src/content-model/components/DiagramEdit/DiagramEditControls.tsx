import { RefObject, useMemo } from 'react';

import Tooltip from '@/src/shared/components/Tooltip/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DiagramEditControlsProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onReset: () => void;
  showReset: boolean;
  isFullscreen: boolean;
  toggleFull: () => void;
}

const DiagramEditControls: React.FC<DiagramEditControlsProps> = (props) => {
  const {
    scale,
    onScaleChange,
    onReset,
    showReset,
    isFullscreen,
    toggleFull,
  } = props;

  const scalePercentage = useMemo(() => {
    return Math.round(scale * 100);
  }, [scale]);

  const nextZoomOutScale = useMemo(() => {
    const nextProbableScale = scale / 1.5;

    if (scale > 1 && nextProbableScale < 1) {
      return 1;
    }

    if (nextProbableScale < 0.15) {
      return 0.15;
    }

    return nextProbableScale;
  }, [scale]);
  const nextZoomInScale = useMemo(() => {
    const nextProbableScale = scale * 1.5;

    if (scale < 1 && nextProbableScale > 1) {
      return 1;
    }

    if (nextProbableScale > 4) {
      return 4;
    }

    return nextProbableScale;
  }, [scale]);

  return (
    <div className="absolute right-4 bottom-4 flex">
      <button
        className={`appearance-none flex h-8 px-3 mr-2 items-center justify-center text-white font-semibold bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 rounded-full transition-opacity ${
          showReset
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          onReset();
        }}
      >
        Center
      </button>
      <div className="relative mr-2">
        <Tooltip tooltip={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          {(ref, props) => (
            <button
              ref={ref as RefObject<HTMLButtonElement>}
              {...props}
              className="appearance-none flex w-8 h-8 items-center justify-center text-white font-semibold bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 rounded-full"
              onClick={() => {
                toggleFull();

                setTimeout(() => {
                  onReset();
                }, 50);
              }}
            >
              <FontAwesomeIcon
                icon={['fas', isFullscreen ? 'compress' : 'expand']}
                fixedWidth
              />
            </button>
          )}
        </Tooltip>
      </div>
      <div className="flex">
        <div className="relative">
          <Tooltip tooltip="Zoom out" align="topcenter">
            {(ref, props) => (
              <button
                ref={ref as RefObject<HTMLButtonElement>}
                {...props}
                className="appearance-none flex w-8 h-8 items-center justify-center text-white bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 rounded-full rounded-r-none border-r border-primary-300"
                onClick={() => {
                  onScaleChange(nextZoomOutScale);
                }}
              >
                <FontAwesomeIcon icon={['fas', 'search-minus']} fixedWidth />
              </button>
            )}
          </Tooltip>
        </div>
        <p className="flex w-14 h-8 items-center justify-center bg-primary-500 text-white font-semibold text-base cursor-default">
          {scalePercentage}%
        </p>
        <div className="relative">
          <Tooltip tooltip="Zoom in" align="topright">
            {(ref, props) => (
              <button
                ref={ref as RefObject<HTMLButtonElement>}
                {...props}
                className="appearance-none flex w-8 h-8 items-center justify-center text-white bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 rounded-full rounded-l-none border-l border-primary-300"
                onClick={() => {
                  onScaleChange(nextZoomInScale);
                }}
              >
                <FontAwesomeIcon icon={['fas', 'search-plus']} fixedWidth />
              </button>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default DiagramEditControls;
