import { useRef } from 'react';
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayContainer,
  useDialog,
  FocusScope,
} from 'react-aria';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ModalDialog.module.css';

interface ModalDialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isDismissable: boolean;
}

const ModalDialog: React.FC<ModalDialogProps> = (props) => {
  const { title, children, onClose } = props;

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
      <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-primary-900 dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-80 flex items-center justify-center">
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...overlayProps}
            {...dialogProps}
            {...modalProps}
            ref={ref}
            className={`relative bg-white dark:bg-gray-700 p-6 w-full max-w-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sepia-500 ${styles.modalBody}`}
          >
            <h3 {...titleProps} className="text-lg font-semibold mr-10">
              {title}
            </h3>
            <div className="mt-6">{children}</div>
            <button
              className="absolute top-5 right-5 appearance-none w-8 h-8 flex items-center justify-center"
              onClick={() => {
                onClose();
              }}
            >
              <FontAwesomeIcon icon={['fal', 'times']} size="2x" />
            </button>
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
};

export default ModalDialog;
