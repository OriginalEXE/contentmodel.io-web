import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';

const calculateConnectionsCount = (
  contentModel: z.infer<typeof contentModelSchema>,
): number => {
  let connectionsCount = 0;

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

      connectionsCount += linksToContentTypes.length;
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

      connectionsCount += linksToContentTypes.length;
    });
  });

  return connectionsCount;
};

export default calculateConnectionsCount;
