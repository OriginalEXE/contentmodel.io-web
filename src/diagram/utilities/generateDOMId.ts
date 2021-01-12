export const generateContentTypeDOMId = (contentTypeId: string): string => {
  return `ctf-${contentTypeId}`;
};

export const generateContentTypeFieldDOMId = (
  contentTypeId: string,
  contentTypeFieldId: string,
): string => {
  return `ctf-${contentTypeId}-${contentTypeFieldId}`;
};
