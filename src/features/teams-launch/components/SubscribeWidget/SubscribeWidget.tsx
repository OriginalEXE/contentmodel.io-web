import { useEffect } from 'react';

import useScript from '@/src/use-script/useScript';

const SubscribeWidget: React.FC = () => {
  const scriptStatus = useScript(
    'https://app.mailjet.com/statics/js/iframeResizer.min.js',
  );

  useEffect(() => {
    if (scriptStatus !== 'ready') {
      return;
    }

    if (typeof (window as any).iFrameResize !== 'function') {
      return;
    }

    (window as any).iFrameResize({}, '.mj-w-res-iframe');
  }, [scriptStatus]);

  return scriptStatus === 'ready' ? (
    <iframe
      title="Teams launch subscribe"
      className="mj-w-res-iframe"
      frameBorder="0"
      scrolling="no"
      marginHeight={0}
      marginWidth={0}
      src="https://app.mailjet.com/widget/iframe/6s3d/Hx5"
      width="100%"
    ></iframe>
  ) : null;
};

export default SubscribeWidget;
