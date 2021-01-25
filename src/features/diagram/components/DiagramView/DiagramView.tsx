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
import {
  generateContentTypeDOMId,
  generateContentTypeFieldDOMId,
} from '@/src/features/diagram/utilities/generateDOMId';
import * as jsPlumb from '@jsplumb/browser-ui';
import { Connection } from '@jsplumb/community-core';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

import styles from './DiagramView.module.css';

// We want to have some empty space around the drawn content model
const DIAGRAM_INITIAL_DRAW_PADDING = 40;

interface DiagramViewProps {
  contentModel: ParsedDbContentModel;
  className?: string;
}

const DiagramView: React.FC<DiagramViewProps> = (props) => {
  const { contentModel, className = '' } = props;

  // Topmost container ref
  const componentWrapEl = useRef<HTMLDivElement>(null);

  // Map of all connection elements
  const connectionElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Toggled on when initial drawing is finished
  const [initialDrawingFinished, setInitialDrawingFinished] = useState(false);

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
    | { scale: number; position: { x: number; y: number } }
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

    const connections: Connection[] = [];

    instance.setSuspendDrawing(true);

    contentModel.model.forEach((contentType) => {
      const singleReferenceFields = contentType.fields.filter(
        (field) => field.type === 'Link',
      );

      singleReferenceFields.forEach((field) => {
        // Get a list of all content types that this reference field possibly
        // references
        const linksToContentTypes: string[] = (() => {
          if (field.linkType === 'Asset') {
            return ['asset'];
          }

          const registeredContentTypes = contentModel.model.map(
            (cType) => cType.sys.id,
          );

          if (
            field.validations === undefined ||
            field.validations.length === 0
          ) {
            return registeredContentTypes;
          }

          const linkContentTypeValidation = field.validations.find(
            (validation) =>
              validation.linkContentType !== undefined &&
              validation.linkContentType.length !== 0,
          );

          if (linkContentTypeValidation === undefined) {
            return registeredContentTypes;
          }

          return linkContentTypeValidation.linkContentType.length === 0
            ? contentModel.model.map((cType) => cType.sys.id)
            : linkContentTypeValidation.linkContentType.filter(
                (cTypeId: string) =>
                  registeredContentTypes.includes(cTypeId) === true,
              );
        })();

        linksToContentTypes.forEach((cTypeId) => {
          // Store elements into our ref for later reuse
          const sourceElId = generateContentTypeFieldDOMId(
            contentType.sys.id,
            field.id,
          );
          const sourceEl = document.getElementById(sourceElId)!;
          const targetElId = generateContentTypeDOMId(cTypeId);
          const targetEl = document.getElementById(targetElId)!;

          if (connectionElementsRef.current.has(sourceElId) === false) {
            connectionElementsRef.current.set(sourceElId, sourceEl);
          }

          if (connectionElementsRef.current.has(targetElId) === false) {
            connectionElementsRef.current.set(targetElId, targetEl);
          }

          connections.push(
            instance.connect({
              source: sourceEl,
              target: targetEl,
              detachable: false,
              anchors: ['ContinuousLeftRight', 'Top'],
              endpoints: ['Blank', 'Dot'],
              connector: [
                'Flowchart',
                {
                  stub: 10,
                  gap: 10,
                  cssClass: `${styles.stroke} text-sepia-300  js-connects-${contentType.sys.id} js-connects-${cTypeId}`,
                },
              ],
            }),
          );

          setConnectionIds((x) => [...x, generateContentTypeDOMId(cTypeId)]);

          const sourceCTypeEl = document.getElementById(
            generateContentTypeDOMId(contentType.sys.id),
          )!;

          sourceCTypeEl.classList.add(
            `${CONTENT_TYPE_CONNECTED_TO_PREFIX}${cTypeId}`,
          );
          targetEl.classList.add(
            `${CONTENT_TYPE_CONNECTED_TO_PREFIX}${contentType.sys.id}`,
          );
        });
      });

      const multiReferenceFields = contentType.fields.filter(
        (field) => field.type === 'Array' && field.items?.type === 'Link',
      );

      multiReferenceFields.forEach((field) => {
        if (field.items === undefined) {
          return;
        }

        // Get a list of all content types that this reference field possibly
        // references
        const linksToContentTypes: string[] = (() => {
          if (field.items.linkType === 'Asset') {
            return ['asset'];
          }

          const registeredContentTypes = contentModel.model.map(
            (cType) => cType.sys.id,
          );

          if (
            field.items.validations === undefined ||
            field.items.validations.length === 0
          ) {
            return registeredContentTypes;
          }

          const linkContentTypeValidation = field.items.validations.find(
            (validation) =>
              validation.linkContentType !== undefined &&
              validation.linkContentType.length !== 0,
          );

          if (linkContentTypeValidation === undefined) {
            return registeredContentTypes;
          }

          return linkContentTypeValidation.linkContentType.length === 0
            ? contentModel.model.map((cType) => cType.sys.id)
            : linkContentTypeValidation.linkContentType.filter(
                (cTypeId: string) =>
                  registeredContentTypes.includes(cTypeId) === true,
              );
        })();

        linksToContentTypes.forEach((cTypeId) => {
          // Store elements into our ref for later reuse
          const sourceElId = generateContentTypeFieldDOMId(
            contentType.sys.id,
            field.id,
          );
          const sourceEl = document.getElementById(sourceElId)!;
          const targetElId = generateContentTypeDOMId(cTypeId);
          const targetEl = document.getElementById(targetElId)!;

          if (connectionElementsRef.current.has(sourceElId) === false) {
            connectionElementsRef.current.set(sourceElId, sourceEl);
          }

          if (connectionElementsRef.current.has(targetElId) === false) {
            connectionElementsRef.current.set(targetElId, targetEl);
          }

          connections.push(
            instance.connect({
              source: sourceEl,
              target: targetEl,
              detachable: false,
              anchors: ['ContinuousLeftRight', 'Top'],
              endpoints: ['Blank', 'Dot'],
              connector: [
                'Flowchart',
                {
                  stub: 10,
                  gap: 10,
                  cssClass: `${styles.stroke} text-sepia-300 ${CONTENT_TYPE_CONNECTION_PREFIX}${contentType.sys.id} ${CONTENT_TYPE_CONNECTION_PREFIX}${cTypeId}`,
                },
              ],
            }),
          );

          setConnectionIds((x) => [...x, generateContentTypeDOMId(cTypeId)]);

          const sourceCTypeEl = document.getElementById(
            generateContentTypeDOMId(contentType.sys.id),
          )!;

          sourceCTypeEl.classList.add(
            `${CONTENT_TYPE_CONNECTED_TO_PREFIX}${cTypeId}`,
          );
          targetEl.classList.add(
            `${CONTENT_TYPE_CONNECTED_TO_PREFIX}${contentType.sys.id}`,
          );
        });
      });
    });

    instance.setSuspendDrawing(false, true);

    setPlumbInstance(instance);

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
      className={`relative border rounded-lg border-sepia-300 bg-sepia-200 ${className}`}
      ref={componentWrapEl}
    >
      <div
        className={`transition-opacity delay-100 overflow-hidden ${
          initialDrawingFinished
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={panningContainerRef}
          className={`${styles.panningContainer} ${
            isFullscreen ? styles.panningContainerFullscreen : ''
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
                  contentModel.position.contentTypes[contentType.sys.id]
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
      </div>
    </div>
  );
};

export default DiagramView;
