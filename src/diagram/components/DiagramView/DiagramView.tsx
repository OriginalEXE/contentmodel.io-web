import { useFullscreen } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

import DraggableContentType from '@/src/content-model/components/DraggableContentType/DraggableContentType';
import { ParsedDbContentModel } from '@/src/content-model/types/parsedDbContentModel';
import styles from '@/src/diagram/components/DiagramView/DiagramView.module.css';
import DiagramViewControls from '@/src/diagram/components/DiagramViewControls/DiagramViewControls';
import {
  generateContentTypeDOMId,
  generateContentTypeFieldDOMId,
} from '@/src/diagram/utilities/generateDOMId';
import * as jsPlumb from '@jsplumb/community';
import { Connection } from '@jsplumb/community/types/core';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

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

    const instance = jsPlumb.newInstance({
      container: diagramContainerRef.current,
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
          connections.push(
            instance.connect({
              source: generateContentTypeFieldDOMId(
                contentType.sys.id,
                field.id,
              ),
              target: generateContentTypeDOMId(cTypeId),
              detachable: false,
              anchors: ['ContinuousLeftRight', 'Top'],
              endpoints: ['Blank', 'Dot'],
              connector: [
                'Flowchart',
                {
                  stub: 10,
                  gap: 10,
                  cssClass: `${styles.stroke} text-gray-400`,
                },
              ],
            }),
          );

          setConnectionIds((x) => [...x, generateContentTypeDOMId(cTypeId)]);
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
          connections.push(
            instance.connect({
              source: generateContentTypeFieldDOMId(
                contentType.sys.id,
                field.id,
              ),
              target: generateContentTypeDOMId(cTypeId),
              detachable: false,
              anchors: ['ContinuousLeftRight', 'Top'],
              endpoints: ['Blank', 'Dot'],
              connector: [
                'Flowchart',
                {
                  stub: 10,
                  gap: 10,
                  cssClass: `${styles.stroke} text-gray-400`,
                },
              ],
            }),
          );

          setConnectionIds((x) => [...x, generateContentTypeDOMId(cTypeId)]);
        });
      });
    });

    instance.setSuspendDrawing(false, true);

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramContainerRef, contentModel]);

  useEffect(() => {
    if (plumbInstance === undefined || initialDrawingFinished === true) {
      return;
    }

    setInitialDrawingFinished(true);

    connectionIds.forEach((id) => {
      plumbInstance.revalidate(id);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plumbInstance, connectionIds, initialDrawingFinished]);

  return (
    <div
      className={`relative border rounded-lg border-gray-300 bg-gray-200 ${className}`}
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
          <div ref={diagramContainerRef} className="relative">
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

                  plumbInstance.revalidate(
                    generateContentTypeDOMId(contentType.sys.id),
                  );
                }}
              />
            ))}
          </div>
        </div>
        <DiagramViewControls
          scale={panScale}
          onScaleChange={(newScale) => {
            if (panZoomInstance.current === undefined) {
              return;
            }

            setPanScale(newScale);
            setPanChanged(true);
            panZoomInstance.current.zoom(newScale, { animate: true });
          }}
          onReset={() => {
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
          }}
          showReset={panChanged}
          isFullscreen={isFullscreen}
          toggleFull={toggleFull}
        />
      </div>
    </div>
  );
};

export default DiagramView;
