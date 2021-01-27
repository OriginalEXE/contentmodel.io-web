import { createElement, ReactText } from 'react';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import sanitize from 'rehype-sanitize';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';

import styles from '@/src/shared/components/StyledDynamicContent/StyledDynamicContent.module.css';

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(highlight)
  .use(sanitize)
  .use(rehype2react, {
    createElement: createElement,
  });

interface StyledDynamicContent {
  className?: string;
}

const StyledDynamicContent: React.FC<StyledDynamicContent> = (props) => {
  const { children, className } = props;

  if (typeof children !== 'string') {
    return null;
  }

  return (
    <div className={`${styles.content} ${className}`}>
      {processor.processSync(children).result as ReactText}
    </div>
  );
};

export default StyledDynamicContent;
