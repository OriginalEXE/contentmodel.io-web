import useScript from '@/src/use-script/useScript';

const SubscribeWidget: React.FC = () => {
  useScript(
    'https://app.mailjet.com/pas-nc-pop-in-v1.js',
  );

  return  (
    <div>
      <p className="p-2 text-center" style={{
        backgroundColor: '#F4F4F4',
      }}>A new and updated version of ContentModel.io is coming with many exciting new features 👀</p>
      <>
        <iframe data-w-token="42d8a83fcc9e255da714" data-w-type="pop-in" frameBorder="0" scrolling="yes" marginHeight="0" marginWidth="0" src="https://x7yh9.mjt.lu/wgt/x7yh9/l1p/form?c=d7532988" width="100%" style={{ height: 0 }} />
        <iframe data-w-token="42d8a83fcc9e255da714" data-w-type="trigger" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://x7yh9.mjt.lu/wgt/x7yh9/l1p/trigger?c=4a2d09a1" width="100%" style={{ height: 0 }} />
      </>
    </div>
  );
};

export default SubscribeWidget;
