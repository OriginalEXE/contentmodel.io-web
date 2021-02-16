import remark from 'remark';
import strip from 'strip-markdown';

const processor = remark().use(strip);

export const markdownToText = (markdown: string): string => {
  return processor.processSync(markdown).contents as string;
};
