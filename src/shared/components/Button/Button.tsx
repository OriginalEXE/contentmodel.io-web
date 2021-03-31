import React from 'react';

import { ButtonPropsInterface, getButtonClassName } from './getButtonClassName';

const Button = React.forwardRef<HTMLButtonElement, ButtonPropsInterface>(
  (
    {
      children,
      className = '',
      color = 'default',
      size = 'regular',
      grow = true,
      type = 'button',
      onClick = () => {
        // Do nothing
      },
      htmlAttributes = {},
      variant = 'contained',
      disabled = false,
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={getButtonClassName({
          className,
          color,
          size,
          grow,
          variant,
          disabled,
        })}
        type={type}
        disabled={disabled}
        {...htmlAttributes}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
