import { useRef } from 'react';
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayContainer,
  useDialog,
  FocusScope,
} from 'react-aria';

import styles from './ModalDialog.module.css';

interface ModalDialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isDismissable: boolean;
}

const ModalDialog: React.FC<ModalDialogProps> = (props) => {
  const { title, children } = props;

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog({}, ref);

  return (
    <OverlayContainer>
      <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-primary-900 bg-opacity-70 flex items-center justify-center">
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...overlayProps}
            {...dialogProps}
            {...modalProps}
            ref={ref}
            className={`relative bg-white p-6 w-full max-w-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sepia-500 ${styles.modalBody}`}
          >
            <h3 {...titleProps} className="text-lg font-semibold">
              {title}
            </h3>
            <div className="mt-6">{children}</div>
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
};

export default ModalDialog;
