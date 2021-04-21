import { HTMLAttributes, ReactNode, RefObject, useMemo, useRef } from 'react';
import { mergeProps, useTooltip, useTooltipTrigger } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';

import { HoverProps, PressProps } from '@react-aria/interactions';
import { FocusEvents } from '@react-types/shared';

interface TooltipProps {
  children: (
    ref: RefObject<HTMLElement>,
    props: HTMLAttributes<HTMLElement> & PressProps & HoverProps & FocusEvents,
  ) => ReactNode;
  tooltip: ReactNode;
  align?: 'topleft' | 'topcenter' | 'topright';
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const { children, tooltip, align = 'topcenter' } = props;

  const state = useTooltipTriggerState({ delay: 500 });
  const triggerRef = useRef<HTMLElement | HTMLButtonElement>(null);
  const { triggerProps, tooltipProps: tooltipParams } = useTooltipTrigger(
    {},
    state,
    triggerRef,
  );
  const { tooltipProps } = useTooltip(
    tooltipParams as HTMLAttributes<HTMLElement> & { children: ReactNode },
  );

  const alignClasses = useMemo(() => {
    if (align === 'topcenter') {
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }

    if (align === 'topleft') {
      return 'bottom-full left-0 mb-2';
    }

    // align === 'topright'
    return 'bottom-full right-0 mb-2';
  }, [align]);

  return (
    <>
      {children(triggerRef, triggerProps)}
      {state.isOpen ? (
        <div
          {...mergeProps(tooltipParams, tooltipProps)}
          className={`absolute w-32 bg-gray-300 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-base text-center ${alignClasses}`}
        >
          {tooltip}
        </div>
      ) : null}
    </>
  );
};

export default Tooltip;
