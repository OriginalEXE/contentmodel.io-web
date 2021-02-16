import { ReactText } from 'react';

import { markdownToText } from '@/src/formatting/markdown';

const MarkdownToText: React.FC = (props) => {
  const { children } = props;

  if (typeof children !== 'string') {
    return null;
  }

  return <>{markdownToText(children) as ReactText}</>;
};

export default MarkdownToText;
