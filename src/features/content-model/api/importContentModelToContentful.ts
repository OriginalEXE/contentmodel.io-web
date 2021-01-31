interface ImportContentModelToContentfulInput {
  spaceId: string;
  token: string;
  slug: string;
  publish: boolean;
}

type ImportContentModelToContentfulResult =
  | { error: string }
  | { error: undefined };

const importContentModelToContentful = async (
  input: ImportContentModelToContentfulInput,
): Promise<ImportContentModelToContentfulResult> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/importToContentful?spaceId=${
      input.spaceId
    }&token=${input.token}&slug=${input.slug}&publish=${
      input.publish === true ? 1 : 0
    }`,
  ).then((res) => res.json());
};

export default importContentModelToContentful;
