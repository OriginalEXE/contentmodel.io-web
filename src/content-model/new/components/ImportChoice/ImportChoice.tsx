import { useEffect, useRef, useState } from 'react';
import {
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from 'react-aria';
import { RadioGroupState, useRadioGroupState } from 'react-stately';

import optimizeLineBreak from '@/src/typography/optimize-line-break';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type ImportTypeChoices = 'copyPaste' | 'spaceimport';

interface ImportChoiceItemProps {
  choiceState: RadioGroupState;
  value: ImportTypeChoices;
  title: string;
  description: string;
  icon: IconName;
}

const ImportChoiceItem: React.FC<ImportChoiceItemProps> = (props) => {
  const { choiceState, value, title, description, icon } = props;

  const ref = useRef(null);
  const { inputProps } = useRadio(props, choiceState, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  const isSelected = choiceState.selectedValue === value;

  return (
    <label
      className={`relative rounded-lg p-4 border-b-4 text-center cursor-pointer ${
        isSelected
          ? 'bg-green-300 border-green-700'
          : 'bg-white border-gray-400'
      } ${isFocusVisible ? 'ring-2 ring-green-900' : ''}`}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <h3 className="font-semibold text-base md:text-lg">{title}</h3>
      <p className="text-base mt-2">{description}</p>
      {isSelected ? (
        <div className="absolute -right-4 -top-4 rotate-12 transform bg-green-700 w-12 h-12 flex items-center justify-center rounded-full text-green-50">
          <FontAwesomeIcon icon={['fas', icon]} size="lg" fixedWidth />
        </div>
      ) : null}
    </label>
  );
};

interface ImportChoiceProps {
  onChoice: (choice: ImportTypeChoices | undefined) => void;
  defaultValue?: ImportTypeChoices;
}

const ImportChoice: React.FC<ImportChoiceProps> = (props) => {
  const { onChoice, defaultValue } = props;

  const choiceState = useRadioGroupState({
    label: 'Import type',
    defaultValue: defaultValue || undefined,
  });
  const { radioGroupProps, labelProps } = useRadioGroup(
    { label: 'Import type' },
    choiceState,
  );

  // Keep track of chosen value
  const [chosenImportChoice, setChosenImportChoice] = useState(
    choiceState.selectedValue,
  );

  useEffect(() => {
    if (choiceState.selectedValue === chosenImportChoice) {
      return;
    }

    setChosenImportChoice(choiceState.selectedValue);
    onChoice(choiceState.selectedValue as ImportTypeChoices);
  }, [choiceState.selectedValue, chosenImportChoice, onChoice]);

  return (
    <div {...radioGroupProps}>
      <h2 className="text-xl text-center mt-4" {...labelProps}>
        {optimizeLineBreak(
          'Choose between different ways of importing the content model:',
        )}
      </h2>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <ImportChoiceItem
          choiceState={choiceState}
          value="copyPaste"
          title="Copy/paste"
          description="Export the content model JSON and paste it here"
          icon="i-cursor"
        >
          Manual input
        </ImportChoiceItem>
        <ImportChoiceItem
          choiceState={choiceState}
          value="spaceimport"
          title="Import from a space"
          description="You will need the Space ID + Management Token"
          icon="cloud-download"
        >
          Import from a space
        </ImportChoiceItem>
      </div>
    </div>
  );
};

export default ImportChoice;
