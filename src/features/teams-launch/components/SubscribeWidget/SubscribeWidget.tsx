import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';

const SubscribeWidget: React.FC = () => {
  return  (
    <div>
      <p className="p-2 text-center" style={{
        backgroundColor: '#F4F4F4',
      color: 'rgb(17, 24, 39)'
      }}>A new and updated version of ContentModel.io is coming with many exciting new features 👀</p>
      <div className="flex items-center justify-center p-1" style={{
        backgroundColor: '#F4F4F4',
      }}>
        <a
          className={getButtonClassName({
            size: 's',
          })}
          href="https://x7yh9.mjt.lu/wgt/x7yh9/x72v/form?c=730f8c6b"
        >
          Notify on early access
        </a>
      </div>
    </div>
  );
};

export default SubscribeWidget;
