export interface ButtonPropsInterface {
  children: any;
  className?: string;
  color?: 'primary' | 'secondary' | 'clear' | 'danger' | 'default';
  variant?: 'text' | 'contained';
  size?: 'regular' | 's' | 'lg';
  grow?: boolean;
  type?: 'button' | 'submit';
  htmlAttributes?: {
    [name: string]: string;
  };
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export interface GetButtonClassNameInputInterface {
  className?: ButtonPropsInterface['className'];
  color?: ButtonPropsInterface['color'];
  size?: ButtonPropsInterface['size'];
  grow?: ButtonPropsInterface['grow'];
  variant?: ButtonPropsInterface['variant'];
  disabled?: ButtonPropsInterface['disabled'];
}

export const getButtonClassName = ({
  className = '',
  color = 'default',
  size = 'regular',
  grow = true,
  variant = 'contained',
  disabled = false,
}: GetButtonClassNameInputInterface = {}): string => {
  let colorClasses = '';

  if (variant === 'text') {
    switch (color) {
      case 'primary':
        colorClasses =
          'text-primary-600 hover:text-primary-700 focus:text-primary-700';
        break;
      case 'danger':
        colorClasses = 'text-red-600 hover:text-red-700 focus:text-red-700';
        break;
      default:
        colorClasses = 'text-gray-800 hover:text-gray-900 focus:text-gray-900';
        break;
    }
  } else {
    // variant === 'contained'
    switch (color) {
      case 'primary':
        colorClasses =
          'text-primary-700 bg-primary-300 border border-transparent hover:bg-primary-400 focus:bg-primary-400';
        break;
      case 'secondary':
        colorClasses =
          'text-seagreen-800 bg-seagreen-300 border border-transparent hover:bg-seagreen-400 focus:bg-seagreen-400';
        break;
      case 'clear':
        colorClasses =
          'text-pinkGray-900 bg:transparent border border-pinkGray-400 hover:text-pinkGray-900 hover:bg-pinkGray-200 focus:text-pinkGray-900 focus:bg-pinkGray-200';
        break;
      case 'danger':
        colorClasses =
          'text-white bg-red-600 border border-transparent hover:bg-red-700 focus:bg-red-700';
        break;
      default:
        colorClasses =
          'text-pinkGray-900 bg-pinkGray-100 border border-transparent hover:text-pinkGray-900 hover:bg-pinkGray-200 focus:text-pinkGray-900 focus:bg-pinkGray-200';
        break;
    }
  }

  let sizeClasses = '';

  switch (size) {
    case 's':
      sizeClasses = 'text-sm py-1';

      if (variant !== 'text') {
        sizeClasses = `${sizeClasses} px-4`;
      }

      if (grow === true) {
        sizeClasses = `${sizeClasses} lg:text-base`;
      }
      break;
    case 'lg':
      sizeClasses = 'text-lg py-2';

      if (variant !== 'text') {
        sizeClasses = `${sizeClasses} px-5`;
      }

      if (grow === true) {
        sizeClasses = `${sizeClasses} lg:text-xl`;
      }
      break;

    default:
      sizeClasses = 'text-base py-2';

      if (variant !== 'text') {
        sizeClasses = `${sizeClasses} px-5`;
      }

      if (grow === true) {
        sizeClasses = `${sizeClasses} lg:text-lg`;
      }
      break;
  }

  return `inline-block font-medium appearance-none transition-colors duration-150 ease-in-out focus:outline-none focus-visible:underline ${colorClasses} ${sizeClasses} ${className} rounded-md ${
    disabled ? 'opacity-70' : ''
  }`;
};
