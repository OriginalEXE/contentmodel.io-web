import styles from './DiagramViewSSRLoading.module.css';

interface DiagramViewSSRLoading {
  error?: Error | null;
  isLoading?: boolean;
  pastDelay?: boolean;
  retry?: () => void;
  timedOut?: boolean;
  className?: string;
}

const DiagramViewSSRLoading: React.FC<DiagramViewSSRLoading> = (props) => {
  const { className } = props;

  return (
    <div className={`flex items-center justify-center ${styles.container}`}>
      <p className={`text-lg ${className}`}>Loading...</p>
    </div>
  );
};

DiagramViewSSRLoading.displayName = 'DiagramViewSSRLoading';

export default DiagramViewSSRLoading;
