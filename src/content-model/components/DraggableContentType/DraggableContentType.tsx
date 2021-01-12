import { useState, forwardRef } from 'react';
import { DraggableCore } from 'react-draggable';
import * as z from 'zod';

import ContentType, {
  ContentTypeProps,
} from '@/src/diagram/components/ContentType/ContentType';
import contentTypePositionSchema from '@/src/diagram/types/contentTypePosition';

interface DraggableContentType extends ContentTypeProps {
  scale: number;
  onDrag: (position: z.infer<typeof contentTypePositionSchema>) => void;
  startPosition: z.infer<typeof contentTypePositionSchema>;
}

const DraggableContentType = forwardRef<HTMLDivElement, DraggableContentType>(
  (props, ref) => {
    const { scale, onDrag, startPosition, ...otherProps } = props;

    const [isBeingDragged, setIsBeingDragged] = useState(false);

    const [position, setPosition] = useState(startPosition);

    return (
      <DraggableCore
        scale={scale}
        onStart={() => {
          if (isBeingDragged !== true) {
            setIsBeingDragged(true);
          }
        }}
        onDrag={(_event, data) => {
          const newPosition = {
            x: position.x + data.deltaX,
            y: position.y + data.deltaY,
          };

          setPosition(newPosition);
          onDrag(newPosition);
        }}
        onStop={() => {
          if (isBeingDragged === true) {
            setIsBeingDragged(false);
          }
        }}
      >
        <div
          ref={ref}
          className={`panzoom-exclude absolute z-20 rounded-lg ${
            isBeingDragged ? 'ring-2' : ''
          }`}
          style={{
            left: position.x,
            top: position.y,
            cursor: isBeingDragged ? 'grabbing' : 'grab',
          }}
        >
          <ContentType {...otherProps} />
        </div>
      </DraggableCore>
    );
  },
);

DraggableContentType.displayName = 'DraggableContentType';

export default DraggableContentType;
