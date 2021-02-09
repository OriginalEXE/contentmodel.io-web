import queryString from 'query-string';

interface ImportContentModelToContentfulInput {
  spaceId: string;
  token: string;
  environmentId: string;
  slug: string;
  publish: boolean;
  contentTypes?: string[];
}

type ImportContentModelToContentfulResult =
  | { error: string }
  | { error: undefined };

const importContentModelToContentful = async (
  input: ImportContentModelToContentfulInput,
): Promise<ImportContentModelToContentfulResult> => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/importToContentful`;
  const finalUrl = queryString.stringifyUrl({
    url: baseUrl,
    query: {
      spaceId: input.spaceId,
      token: input.token,
      environmentId: input.environmentId,
      slug: input.slug,
      publish: input.publish === true ? 1 : 0,
      contentTypes: input.contentTypes,
    },
  });

  return fetch(finalUrl).then((res) => res.json());
};

export default importContentModelToContentful;
