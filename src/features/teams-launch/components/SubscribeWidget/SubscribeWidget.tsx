import useScript from '@/src/use-script/useScript';

const SubscribeWidget: React.FC = () => {
  const scriptStatus = useScript(
    'https://app.mailjet.com/pas-nc-pop-in-v1.js',
  );

  return  (
    <div>
      <p className="p-2 text-center" style={{
        backgroundColor: '#F4F4F4',
      }}>A new and updated version of ContentModel.io is coming with many exciting new features 👀</p>
      <>
        <iframe
          data-w-token="6ba5d6a4093483f7459a"
          data-w-type="pop-in"
          scrolling="no"
          src="https://x7yh9.mjt.lu/wgt/x7yh9/l1p/form?c=d7532988"
          width="100%"
          style={{
            margin: 0,
            border: 0,
            width: "100%",
            position: "fixed",
            height: scriptStatus === 'ready' ? '100vh' : 0,
            top: 0,
            zIndex: -999999,
            maxWidth: 600,
            left: "calc(50vw - 300px)",
            opacity: scriptStatus === 'ready' ? 1 : 0
          }}
        />
        <iframe
          data-w-token="6ba5d6a4093483f7459a"
          data-w-type="trigger"
          scrolling="no"
          src="https://x7yh9.mjt.lu/wgt/x7yh9/l1p/trigger?c=4a2d09a1"
          width="100%"
          style={{ margin: 0, border: 0, height: scriptStatus === 'ready' ? undefined : 0 }}
        />
      </>
    </div>
  );
};

export default SubscribeWidget;
