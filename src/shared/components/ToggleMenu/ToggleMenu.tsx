import Link from 'next/link';
import {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  ReactText,
  useRef,
  useState,
} from 'react';
import {
  useButton,
  useMenu,
  useMenuTrigger,
  useOverlay,
  FocusScope,
  DismissButton,
  mergeProps,
  useMenuItem,
  useFocus,
  VisuallyHidden,
} from 'react-aria';
import { TreeState, useMenuTriggerState, useTreeState } from 'react-stately';

import { MenuTriggerProps } from '@react-types/menu';
import { CollectionChildren, FocusStrategy } from '@react-types/shared';

interface ToggleMenuItem {
  item: {
    key: ReactText;
    isDisabled?: boolean;
    rendered: ReactNode;
  };
  state: TreeState<ReactElement>;
  onAction: (key: ReactText) => void;
  onClose: () => void;
}

const ToggleMenuItem: React.FC<ToggleMenuItem> = ({
  item,
  state,
  onAction,
  onClose,
}) => {
  const ref = useRef(null);
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled: item.isDisabled,
      onAction,
      onClose,
    },
    state,
    ref,
  );

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  const [isFocused, setFocused] = useState(false);
  const { focusProps } = useFocus({ onFocusChange: setFocused });

  return (
    <li
      {...mergeProps(menuItemProps, focusProps)}
      ref={ref}
      className={`font-medium text-sm ${
        isFocused ? ' bg-seagreen-300 outline-none' : ''
      }`}
    >
      <Link href={item.key as string}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="block px-3 py-2 no-underline text-gray-900">
          {item.rendered}
        </a>
      </Link>
    </li>
  );
};

interface ToggleMenuDropdownProps {
  children: CollectionChildren<ReactElement>;
  onClose: () => void;
  onAction: (key: ReactText) => void;
  domProps: HTMLAttributes<HTMLElement>;
  dropdownAlign?: 'left' | 'right';
  autoFocus: FocusStrategy;
}

const ToggleMenuDropdown: React.FC<ToggleMenuDropdownProps> = (props) => {
  const state = useTreeState({ ...props, selectionMode: 'none' });
  const { dropdownAlign = 'right' } = props;

  const ref = useRef(null);
  const { menuProps } = useMenu(props, state, ref);

  const overlayRef = useRef(null);
  const { overlayProps } = useOverlay(
    {
      onClose: props.onClose,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true,
    },
    overlayRef,
  );

  return (
    <FocusScope restoreFocus>
      <div
        {...overlayProps}
        ref={overlayRef}
        className={`absolute top-full ${dropdownAlign}-0 mt-3 w-48 bg-sepia-100 border border-seagreen-400 rounded overflow-hidden`}
      >
        <DismissButton onDismiss={props.onClose} />
        <ul {...mergeProps(menuProps, props.domProps)} ref={ref}>
          {[...state.collection].map((item) => (
            <ToggleMenuItem
              key={item.key}
              item={item}
              state={state}
              onAction={props.onAction}
              onClose={props.onClose}
            />
          ))}
        </ul>
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  );
};

interface ToggleMenuProps extends MenuTriggerProps {
  buttonClassName: string;
  buttonRender: ReactNode;
  buttonLabel: string;
  children: any;
  dropdownAlign?: 'left' | 'right';
  onAction: (key: ReactText) => void;
}

const ToggleMenu: React.FC<ToggleMenuProps> = (props) => {
  const state = useMenuTriggerState(props);

  const ref = useRef(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, ref);

  const { buttonProps } = useButton(menuTriggerProps, ref);

  return (
    <nav className="relative z-10">
      <div className="flex justify-between items-center">
        <button {...buttonProps} ref={ref} className={props.buttonClassName}>
          <VisuallyHidden>{props.buttonLabel}</VisuallyHidden>
          {props.buttonRender}
        </button>
      </div>
      {state.isOpen ? (
        <ToggleMenuDropdown
          {...props}
          domProps={menuProps}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={state.focusStrategy}
          onClose={() => {
            state.close();
          }}
        >
          {props.children}
        </ToggleMenuDropdown>
      ) : null}
    </nav>
  );
};

export default ToggleMenu;
