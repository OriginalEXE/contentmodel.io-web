import { useFullscreen } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

import DraggableContentType from '@/src/features/content-model/components/DraggableContentType/DraggableContentType';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import DiagramControls from '@/src/features/diagram/components/DiagramControls/DiagramControls';
import {
  CONTENT_TYPE_JS_CLASS,
  CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
  CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
  CONTENT_TYPE_CONNECTION_PREFIX,
  CONTENT_TYPE_CONNECTED_TO_PREFIX,
} from '@/src/features/diagram/constants';
import connectContentTypes from '@/src/features/diagram/utilities/connectContentTypes';
import {
  generateContentTypeDOMId,
  generateContentTypeFieldDOMId,
} from '@/src/features/diagram/utilities/generateDOMId';
import * as jsPlumb from '@jsplumb/browser-ui';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

import styles from './DiagramView.module.css';

// We want to have some empty space around the drawn content model
const DIAGRAM_INITIAL_DRAW_PADDING = 40;

interface DiagramViewProps {
  contentModel: ParsedDbContentModel;
  fillViewport?: boolean;
  showControls?: boolean;
  animatedAppearance?: boolean;
  drawConnections?: boolean;
  className?: string;
}

const DiagramView: React.FC<DiagramViewProps> = (props) => {
  const {
    contentModel,
    fillViewport = false,
    showControls = true,
    animatedAppearance = true,
    drawConnections = true,
    className = '',
  } = props;

  // Topmost container ref
  const componentWrapEl = useRef<HTMLDivElement>(null);

  // Map of all connection elements
  const connectionElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Toggled on when initial drawing is finished
  const [initialDrawingFinished, setInitialDrawingFinished] = useState(false);

  // Toggled when initial plumbing is done
  const [initialPlumbingFinished, setInitialPlumbingFinished] = useState(false);

  // Fullscreen
  const [isFullscreen, { toggleFull }] = useFullscreen(componentWrapEl);

  // Panning
  const panningContainerRef = useRef<HTMLDivElement>(null);
  const panningContentTypesRef = useRef<HTMLDivElement[]>([]);
  const panZoomInstance = useRef<PanzoomObject>();
  const [panScale, setPanScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [panChanged, setPanChanged] = useState(false);

  // To keep the panning stable during fast refresh in development
  const [isInitialPan, setIsInitialPan] = useState(true);

  const calculateCentralPanValues = ():
    | {
        scale: number;
        position: { x: number; y: number };
        totalContentTypesWidth: number;
        totalContentTypesHeight: number;
      }
    | undefined => {
    if (
      panningContainerRef.current === null ||
      panningContentTypesRef.current.length === 0
    ) {
      return;
    }

    const containerEl = panningContainerRef.current;

    const containerWidth =
      containerEl.clientWidth - DIAGRAM_INITIAL_DRAW_PADDING;
    const containerHeight =
      containerEl.clientHeight - DIAGRAM_INITIAL_DRAW_PADDING;

    let leftOffsetZeroDistance = 0;
    let topOffsetZeroDistance = 0;

    const totalContentTypesWidth = (() => {
      const sortedByOffset = panningContentTypesRef.current.sort(
        (a, b) => a.offsetLeft - b.offsetLeft,
      );
      const leftmostEl = sortedByOffset[0];
      const rightmostEl = sortedByOffset[sortedByOffset.length - 1];

      leftOffsetZeroDistance = 0 + leftmostEl.offsetLeft;

      return (
        Math.abs(leftmostEl.offsetLeft - leftOffsetZeroDistance) +
        Math.abs(rightmostEl.offsetLeft - leftOffsetZeroDistance) +
        Math.abs(rightmostEl.scrollWidth)
      );
    })();
    const totalContentTypesHeight = (() => {
      const sortedByOffset = panningContentTypesRef.current.sort(
        (a, b) => a.offsetTop - b.offsetTop,
      );
      const topmostEl = sortedByOffset[0];

      const sortedByBottomOffset = panningContentTypesRef.current.sort(
        (a, b) => a.offsetTop + a.scrollHeight - (b.offsetTop + b.scrollHeight),
      );

      const bottommostEl =
        sortedByBottomOffset[sortedByBottomOffset.length - 1];

      topOffsetZeroDistance = 0 + topmostEl.offsetTop;

      return (
        Math.abs(topmostEl.offsetTop - topOffsetZeroDistance) +
        Math.abs(bottommostEl.offsetTop - topOffsetZeroDistance) +
        Math.abs(bottommostEl.scrollHeight)
      );
    })();

    const childrenToParentWidthRatio = containerWidth / totalContentTypesWidth;
    const childrenToParentHeightRatio =
      containerHeight / totalContentTypesHeight;

    return {
      scale: Math.min(
        1,
        childrenToParentHeightRatio > childrenToParentWidthRatio
          ? childrenToParentWidthRatio
          : childrenToParentHeightRatio,
      ),
      position: {
        x:
          (containerWidth - totalContentTypesWidth) / 2 -
          leftOffsetZeroDistance +
          DIAGRAM_INITIAL_DRAW_PADDING / 2,
        y:
          (containerHeight - totalContentTypesHeight) / 2 -
          topOffsetZeroDistance +
          DIAGRAM_INITIAL_DRAW_PADDING / 2,
      },
      totalContentTypesWidth,
      totalContentTypesHeight,
    };
  };

  useEffect(() => {
    if (
      panningContainerRef.current === null ||
      componentWrapEl.current === null ||
      panningContentTypesRef.current.length === 0
    ) {
      return;
    }

    const componentEl = componentWrapEl.current;
    const containerEl = panningContainerRef.current;

    let startPanScale = panScale;
    let startX = panPosition.x;
    let startY = panPosition.y;

    if (isInitialPan === true) {
      const centralPanValues = calculateCentralPanValues();

      if (centralPanValues !== undefined) {
        startX = centralPanValues.position.x;
        startY = centralPanValues.position.y;

        startPanScale = centralPanValues.scale;

        (window as any).contentmodelio = {
          dimensions: centralPanValues,
        };
      }

      setPanScale(startPanScale);
      setPanPosition({
        x: startX,
        y: startY,
      });
    }

    // Pan and zoom
    const panzoom = Panzoom(containerEl, {
      canvas: true,
      maxScale: 8,
      startScale: startPanScale,
      startX: startX,
      startY: startY,
      silent: true,
    });

    panZoomInstance.current = panzoom;

    const onWheel = (event: WheelEvent) => {
      panzoom.zoomWithWheel(event);

      setPanScale(panzoom.getScale());
      setPanChanged(true);
    };

    componentEl.addEventListener('wheel', onWheel);

    const onPan = (event: any) => {
      setPanPosition({
        x: event.detail.x,
        y: event.detail.y,
      });
      setPanChanged(true);
    };

    containerEl.addEventListener('panzoompan', onPan);

    setIsInitialPan(false);
    setPanChanged(false);

    const disableSilentTimeout = setTimeout(() => {
      panzoom.setOptions({
        silent: false,
      });
    }, 150);

    return () => {
      clearTimeout(disableSilentTimeout);
      panzoom.destroy();

      componentEl.removeEventListener('wheel', onWheel);
      containerEl.removeEventListener('panzoompan', onPan);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentWrapEl, panningContainerRef, panningContentTypesRef]);

  // Plumbing
  const [
    plumbInstance,
    setPlumbInstance,
  ] = useState<jsPlumb.BrowserJsPlumbInstance>();
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const [connectionIds, setConnectionIds] = useState<string[]>([]);

  useEffect(() => {
    if (diagramContainerRef.current === null) {
      return;
    }

    const diagramContainer = diagramContainerRef.current;

    const instance = jsPlumb.newInstance({
      container: diagramContainer,
      elementsDraggable: false,
      connectionsDetachable: false,
    });

    instance.setSuspendDrawing(true);

    const connections = connectContentTypes({
      contentModel: contentModel.model,
      jsPlumbInstance: instance,
      connectionElementsRef,
      styles,
      setConnectionIds,
    });

    // Add hover styles
    const onCTypeMouseover = (e: MouseEvent) => {
      if (e.target === null) {
        return;
      }

      const target = (e.target as Element).closest(`.${CONTENT_TYPE_JS_CLASS}`);

      if (target === null) {
        return;
      }

      if (
        target.classList.contains(CONTENT_TYPE_JS_CLASS) === false ||
        target.classList.contains(CONTENT_TYPE_HIGHLIGHTED_JS_CLASS) === true
      ) {
        return;
      }

      diagramContainer.classList.add(CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS);

      target.classList.add(
        CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
        CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
      );

      const contentType = target.getAttribute('data-content-type');

      if (contentType === null) {
        return;
      }

      const connections = diagramContainer.querySelectorAll(
        `.${CONTENT_TYPE_CONNECTION_PREFIX}${contentType}`,
      );

      if (connections.length > 0) {
        Array.from(connections).forEach((connectionEl) => {
          connectionEl.classList.add(
            CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
            CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
          );
        });
      }

      const connectedContentTypes = diagramContainer.querySelectorAll(
        `.${CONTENT_TYPE_CONNECTED_TO_PREFIX}${contentType}`,
      );

      if (connectedContentTypes.length > 0) {
        Array.from(connectedContentTypes).forEach((connectedCTypeEl) => {
          connectedCTypeEl.classList.add(
            CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
            CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
          );
        });
      }
    };

    diagramContainer.addEventListener('mouseover', onCTypeMouseover);

    const onCTypeMouseout = (e: MouseEvent) => {
      if (e.target === null) {
        return;
      }

      const target = (e.target as Element).closest(`.${CONTENT_TYPE_JS_CLASS}`);

      if (target === null) {
        return;
      }

      if (
        target.classList.contains(CONTENT_TYPE_JS_CLASS) === false ||
        target.classList.contains(CONTENT_TYPE_HIGHLIGHTED_JS_CLASS) === false
      ) {
        return;
      }

      diagramContainer.classList.remove(CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS);

      target.classList.remove(
        CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
        CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
      );

      const contentType = target.getAttribute('data-content-type');

      if (contentType === null) {
        return;
      }

      const connections = diagramContainer.querySelectorAll(
        `.${CONTENT_TYPE_CONNECTION_PREFIX}${contentType}`,
      );

      if (connections.length > 0) {
        Array.from(connections).forEach((connectionEl) => {
          connectionEl.classList.remove(
            CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
            CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
          );
        });
      }

      const connectedContentTypes = diagramContainer.querySelectorAll(
        `.${CONTENT_TYPE_CONNECTED_TO_PREFIX}${contentType}`,
      );

      if (connectedContentTypes.length > 0) {
        Array.from(connectedContentTypes).forEach((connectedCTypeEl) => {
          connectedCTypeEl.classList.remove(
            CONTENT_TYPE_HIGHLIGHTED_JS_CLASS,
            CONTENT_TYPE_HIGHLIGHTED_CSS_CLASS,
          );
        });
      }
    };

    diagramContainer.addEventListener('mouseout', onCTypeMouseout);

    // Finally, draw the connections
    const drawTimeout = setTimeout(() => {
      if (drawConnections === false) {
        setInitialPlumbingFinished(true);
        return;
      }

      instance.setSuspendDrawing(false, true);
      setInitialPlumbingFinished(true);
    }, 300);

    setPlumbInstance(instance);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      connections.forEach((connection) => {
        try {
          instance.deleteConnection(connection, {});

          connection.destroy();
        } catch (e) {
          console.error(e);
        }
      });

      setPlumbInstance(undefined);

      // Clean up event listeners
      diagramContainer.removeEventListener('mouseover', onCTypeMouseover);
      diagramContainer.removeEventListener('mouseout', onCTypeMouseout);

      clearTimeout(drawTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramContainerRef, contentModel]);

  useEffect(() => {
    if (plumbInstance === undefined || initialDrawingFinished === true) {
      return;
    }

    setInitialDrawingFinished(true);

    connectionIds.forEach((id) => {
      const connectionEl = connectionElementsRef.current.get(id);

      if (connectionEl === undefined) {
        return;
      }

      plumbInstance.revalidate(connectionEl);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plumbInstance, connectionIds, initialDrawingFinished]);

  // Reset diagram position
  const resetDiagramPosition = () => {
    if (panZoomInstance.current === undefined) {
      return;
    }

    const centralPanValues = calculateCentralPanValues();

    if (centralPanValues === undefined) {
      return;
    }

    panZoomInstance.current.zoom(centralPanValues.scale, {
      animate: true,
    });
    panZoomInstance.current.pan(
      centralPanValues.position.x,
      centralPanValues.position.y,
      { animate: true },
    );

    setPanScale(centralPanValues.scale);
    setPanPosition(centralPanValues.position);
    setPanChanged(false);
  };

  // Reset diagram when fullscreen is toggled
  useEffect(() => {
    if (initialDrawingFinished === false) {
      return;
    }

    const resetTimeout = setTimeout(resetDiagramPosition, 150);

    return () => {
      clearTimeout(resetTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, initialDrawingFinished]);

  return (
    <div
      className={`relative bg-sepia-100 ${
        fillViewport === true ? '' : 'border border-sepia-300 rounded-lg'
      } ${
        initialPlumbingFinished === true ? 'is-fully-drawn' : ''
      } ${className}`}
      ref={componentWrapEl}
    >
      <div
        className={`overflow-hidden ${
          animatedAppearance === true ? 'transition-opacity delay-100' : ''
        } ${
          initialDrawingFinished
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={panningContainerRef}
          className={`${styles.panningContainer} ${
            isFullscreen === true || fillViewport === true
              ? styles.panningContainerFullscreen
              : ''
          }`}
        >
          <div
            ref={diagramContainerRef}
            className={`relative dd ${styles.diagramContainer}`}
          >
            {contentModel.model.map((contentType, i) => (
              <DraggableContentType
                key={contentType.sys.id}
                ref={(el) => {
                  if (el === null) {
                    return;
                  }

                  panningContentTypesRef.current[i] = el;
                }}
                startPosition={
                  contentModel.position.contentTypes[contentType.sys.id] ?? {
                    x: 0,
                    y: 0,
                  }
                }
                scale={panScale}
                contentType={contentType}
                onDrag={() => {
                  setPanChanged(true);

                  if (plumbInstance === undefined) {
                    return;
                  }

                  const contentTypeEl = connectionElementsRef.current.get(
                    generateContentTypeDOMId(contentType.sys.id),
                  );

                  if (contentTypeEl !== undefined) {
                    plumbInstance.revalidate(contentTypeEl);
                  }

                  const contentTypeFieldPrefix = generateContentTypeFieldDOMId(
                    contentType.sys.id,
                    '',
                  );

                  connectionElementsRef.current.forEach((el, key) => {
                    if (key.startsWith(contentTypeFieldPrefix) === false) {
                      return;
                    }

                    plumbInstance.revalidate(el);
                  });
                }}
                className={styles.contentType}
              />
            ))}
          </div>
        </div>
        {showControls === true ? (
          <DiagramControls
            scale={panScale}
            onScaleChange={(newScale) => {
              if (panZoomInstance.current === undefined) {
                return;
              }

              setPanScale(newScale);
              setPanChanged(true);
              panZoomInstance.current.zoom(newScale, { animate: true });
            }}
            onReset={resetDiagramPosition}
            showReset={panChanged}
            isFullscreen={isFullscreen}
            toggleFull={toggleFull}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DiagramView;
