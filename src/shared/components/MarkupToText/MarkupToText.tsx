import { ReactText } from 'react';
import remark from 'remark';
import strip from 'strip-markdown';

const processor = remark().use(strip);

const MarkupToText: React.FC = (props) => {
  const { children } = props;

  if (typeof children !== 'string') {
    return null;
  }

  return <>{processor.processSync(children).contents as ReactText}</>;
};

export default MarkupToText;
