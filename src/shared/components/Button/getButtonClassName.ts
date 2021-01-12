export interface ButtonPropsInterface {
  children: any;
  className?: string;
  color?: 'primary' | 'danger' | 'default';
  variant?: 'text' | 'contained';
  size?: 'regular' | 's' | 'lg';
  grow?: boolean;
  type?: 'button' | 'submit';
  htmlAttributes?: {
    [name: string]: string;
  };
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface GetButtonClassNameInputInterface {
  className?: ButtonPropsInterface['className'];
  color?: ButtonPropsInterface['color'];
  size?: ButtonPropsInterface['size'];
  grow?: ButtonPropsInterface['grow'];
  variant?: ButtonPropsInterface['variant'];
}

export const getButtonClassName = ({
  className = '',
  color = 'default',
  size = 'regular',
  grow = true,
  variant = 'contained',
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
          'text-white bg-primary-500 hover:bg-primary-600 focus:bg-primary-700';
        break;
      case 'danger':
        colorClasses =
          'text-white bg-red-600 hover:bg-red-700 focus:bg-red-700';
        break;
      default:
        colorClasses =
          'text-gray-800 bg-gray-200 hover:text-gray-900 hover:bg-gray-300 focus:text-gray-900 focus:bg-gray-300';
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

  return `inline-block font-medium appearance-none transition-colors duration-150 ease-in-out focus:outline-none focus-visible:underline ${colorClasses} ${sizeClasses} ${className} rounded-full`;
};
