import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';
import calculateConnectionsCount from '@/src/features/content-model/utilities/calculateConnectionsCount';
import {
  CONTENT_TYPE_CONNECTION_PREFIX,
  CONTENT_TYPE_CONNECTED_TO_PREFIX,
} from '@/src/features/diagram/constants';
import {
  generateContentTypeDOMId,
  generateContentTypeFieldDOMId,
} from '@/src/features/diagram/utilities/generateDOMId';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { Connection } from '@jsplumb/core';

// For use with complex content models, draws less connections
const connectContentTypesLight = ({
  contentModel,
  jsPlumbInstance,
  connectionElementsRef,
  styles,
  setConnectionIds,
}: {
  contentModel: z.infer<typeof contentModelSchema>;
  jsPlumbInstance: BrowserJsPlumbInstance;
  connectionElementsRef: MutableRefObject<Map<string, HTMLElement>>;
  styles: {
    readonly [key: string]: string;
  };
  setConnectionIds: Dispatch<SetStateAction<string[]>>;
}): Connection[] => {
  const connections: Connection[] = [];
  const drawnConnections = new Set<string>();

  contentModel.forEach((contentType) => {
    const singleReferenceFields = contentType.fields.filter(
      (field) => field.type === 'Link',
    );

    singleReferenceFields.forEach((field) => {
      // Get a list of all content types that this reference field possibly
      // references
      const linksToContentTypes: string[] = (() => {
        if (field.linkType === 'Asset') {
          return ['_internal_asset'];
        }

        const registeredContentTypes = contentModel.map(
          (cType) => cType.sys.id,
        );

        if (field.validations === undefined || field.validations.length === 0) {
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
          ? contentModel.map((cType) => cType.sys.id)
          : linkContentTypeValidation.linkContentType.filter(
              (cTypeId: string) =>
                registeredContentTypes.includes(cTypeId) === true,
            );
      })();

      linksToContentTypes.forEach((cTypeId) => {
        // Store elements into our ref for later reuse
        const sourceElId = generateContentTypeDOMId(contentType.sys.id);
        const targetElId = generateContentTypeDOMId(cTypeId);

        const connectionKey = [contentType.sys.id, cTypeId].sort().join('-');

        if (drawnConnections.has(connectionKey)) {
          return;
        }

        drawnConnections.add(connectionKey);

        const sourceEl = document.getElementById(sourceElId)!;
        const targetEl = document.getElementById(targetElId)!;

        if (connectionElementsRef.current.has(sourceElId) === false) {
          connectionElementsRef.current.set(sourceElId, sourceEl);
        }

        if (connectionElementsRef.current.has(targetElId) === false) {
          connectionElementsRef.current.set(targetElId, targetEl);
        }

        connections.push(
          jsPlumbInstance.connect({
            source: sourceEl,
            target: targetEl,
            detachable: false,
            anchors: ['Top', 'Top'],
            endpoints: ['Blank', 'Dot'],
            connector: {
              type: 'Flowchart',
              options: {
                stub: 10,
                gap: 10,
                cssClass: `${styles.stroke} text-sepia-300 ${CONTENT_TYPE_CONNECTION_PREFIX}${contentType.sys.id} ${CONTENT_TYPE_CONNECTION_PREFIX}${cTypeId}`,
              },
            },
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
          return ['_internal_asset'];
        }

        const registeredContentTypes = contentModel.map(
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
          ? contentModel.map((cType) => cType.sys.id)
          : linkContentTypeValidation.linkContentType.filter(
              (cTypeId: string) =>
                registeredContentTypes.includes(cTypeId) === true,
            );
      })();

      linksToContentTypes.forEach((cTypeId) => {
        // Store elements into our ref for later reuse
        const sourceElId = generateContentTypeDOMId(contentType.sys.id);
        const targetElId = generateContentTypeDOMId(cTypeId);

        const connectionKey = [contentType.sys.id, cTypeId].sort().join('-');

        if (drawnConnections.has(connectionKey)) {
          return;
        }

        drawnConnections.add(connectionKey);

        const sourceEl = document.getElementById(sourceElId)!;
        const targetEl = document.getElementById(targetElId)!;

        if (connectionElementsRef.current.has(sourceElId) === false) {
          connectionElementsRef.current.set(sourceElId, sourceEl);
        }

        if (connectionElementsRef.current.has(targetElId) === false) {
          connectionElementsRef.current.set(targetElId, targetEl);
        }

        connections.push(
          jsPlumbInstance.connect({
            source: sourceEl,
            target: targetEl,
            detachable: false,
            anchors: ['Top', 'Top'],
            endpoints: ['Blank', 'Dot'],
            connector: {
              type: 'Flowchart',
              options: {
                stub: 10,
                gap: 10,
                cssClass: `${styles.stroke} text-sepia-300 ${CONTENT_TYPE_CONNECTION_PREFIX}${contentType.sys.id} ${CONTENT_TYPE_CONNECTION_PREFIX}${cTypeId}`,
              },
            },
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

  return connections;
};

const connectContentTypesDetailed = ({
  contentModel,
  jsPlumbInstance,
  connectionElementsRef,
  styles,
  setConnectionIds,
}: {
  contentModel: z.infer<typeof contentModelSchema>;
  jsPlumbInstance: BrowserJsPlumbInstance;
  connectionElementsRef: MutableRefObject<Map<string, HTMLElement>>;
  styles: {
    readonly [key: string]: string;
  };
  setConnectionIds: Dispatch<SetStateAction<string[]>>;
}): Connection[] => {
  const connections: Connection[] = [];

  contentModel.forEach((contentType) => {
    const singleReferenceFields = contentType.fields.filter(
      (field) => field.type === 'Link',
    );

    singleReferenceFields.forEach((field) => {
      // Get a list of all content types that this reference field possibly
      // references
      const linksToContentTypes: string[] = (() => {
        if (field.linkType === 'Asset') {
          return ['_internal_asset'];
        }

        const registeredContentTypes = contentModel.map(
          (cType) => cType.sys.id,
        );

        if (field.validations === undefined || field.validations.length === 0) {
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
          ? contentModel.map((cType) => cType.sys.id)
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
          jsPlumbInstance.connect({
            source: sourceEl,
            target: targetEl,
            detachable: false,
            anchors: ['ContinuousLeftRight', 'Top'],
            endpoints: ['Blank', 'Dot'],
            connector: {
              type: 'Flowchart',
              options: {
                stub: 10,
                gap: 10,
                cssClass: `${styles.stroke} text-sepia-300 ${CONTENT_TYPE_CONNECTION_PREFIX}${contentType.sys.id} ${CONTENT_TYPE_CONNECTION_PREFIX}${cTypeId}`,
              },
            },
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
          return ['_internal_asset'];
        }

        const registeredContentTypes = contentModel.map(
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
          ? contentModel.map((cType) => cType.sys.id)
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
          jsPlumbInstance.connect({
            source: sourceEl,
            target: targetEl,
            detachable: false,
            anchors: ['ContinuousLeftRight', 'Top'],
            endpoints: ['Blank', 'Dot'],
            connector: {
              type: 'Flowchart',
              options: {
                stub: 10,
                gap: 10,
                cssClass: `${styles.stroke} text-sepia-300 ${CONTENT_TYPE_CONNECTION_PREFIX}${contentType.sys.id} ${CONTENT_TYPE_CONNECTION_PREFIX}${cTypeId}`,
              },
            },
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

  return connections;
};

const connectContentTypes = ({
  contentModel,
  jsPlumbInstance,
  connectionElementsRef,
  styles,
  setConnectionIds,
}: {
  contentModel: z.infer<typeof contentModelSchema>;
  jsPlumbInstance: BrowserJsPlumbInstance;
  connectionElementsRef: MutableRefObject<Map<string, HTMLElement>>;
  styles: {
    readonly [key: string]: string;
  };
  setConnectionIds: Dispatch<SetStateAction<string[]>>;
}): Connection[] => {
  const connectionsCount = calculateConnectionsCount(contentModel);

  if (connectionsCount > 100) {
    return connectContentTypesLight({
      contentModel,
      jsPlumbInstance,
      connectionElementsRef,
      styles,
      setConnectionIds,
    });
  }

  return connectContentTypesDetailed({
    contentModel,
    jsPlumbInstance,
    connectionElementsRef,
    styles,
    setConnectionIds,
  });
};

export default connectContentTypes;
