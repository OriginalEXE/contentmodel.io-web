import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';

const SubscribeWidget: React.FC = () => {
  return  (
    <div>
      <p className="p-2 text-center" style={{
        backgroundColor: '#F4F4F4',
      }}>A new and updated version of ContentModel.io is coming with many exciting new features 👀</p>
      <div className="flex items-center p-1">
        <a
          className={getButtonClassName({
            color: 'secondary',
            size: 's',
          })}
          href="mailto:hello@contentmodel.io?subject=New%20version%20early%20access&body=Hello%2C%0A%0AI%20am%20interested%20in%20early%20access%20to%20the%20new%20version%20of%20ContentModel.io%0A%0AI%20would%20like%20to%20use%20it%20for%20..."
        >
          Notify on early access
        </a>
      </div>
    </div>
  );
};

export default SubscribeWidget;
