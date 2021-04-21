import { useEffect, useRef, useState } from 'react';
import {
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from 'react-aria';
import { RadioGroupState, useRadioGroupState } from 'react-stately';
import * as z from 'zod';

import contentfulIcon from '@/src/shared/assets/contentful/icon.svg';
import optimizeLineBreak from '@/src/typography/optimize-line-break';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const importTypeChoiceSchema = z.union([
  z.literal('oauth'),
  z.literal('manual'),
]);

export type ImportTypeChoices = z.infer<typeof importTypeChoiceSchema>;

interface ImportChoiceItemProps {
  choiceState: RadioGroupState;
  value: ImportTypeChoices;
  title: string;
  description: string;
  icon: IconName | 'contentful';
  recommended?: boolean;
  className?: string;
}

const ImportChoiceItem: React.FC<ImportChoiceItemProps> = (props) => {
  const {
    choiceState,
    value,
    title,
    description,
    icon,
    recommended = false,
    className = '',
  } = props;

  const ref = useRef(null);
  const { inputProps } = useRadio(props, choiceState, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  const isSelected = choiceState.selectedValue === value;

  return (
    <label
      className={`relative rounded-lg p-4 border-b-4 text-center cursor-pointer ${
        isSelected
          ? 'bg-green-300 border-green-700'
          : 'bg-sepia-100 border-sepia-300 dark:border-gray-700 dark:bg-gray-800'
      } ${isFocusVisible ? 'ring-2 ring-green-900' : ''} ${className}`}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <h3
        className={`font-semibold text-base md:text-lg ${
          isSelected ? 'text-green-900' : 'text-sepia-800 dark:text-gray-200'
        }`}
      >
        {title}
      </h3>
      <p className={`text-base mt-2 ${isSelected ? 'dark:text-gray-700' : ''}`}>
        {description}
      </p>
      {isSelected ? (
        <div
          className={`absolute -right-1 -top-2 rotate-12 transform w-8 h-8 flex items-center justify-center rounded-full text-green-50 md:-right-3 md:-top-4 md:w-12 md:h-12 ${
            icon === 'contentful'
              ? 'border-2 border-green-700 bg-green-50'
              : 'bg-green-700'
          }`}
        >
          {icon === 'contentful' ? (
            <img
              src={contentfulIcon}
              alt="Contentful icon"
              className="w-4 h-auto md:w-6"
            />
          ) : (
            <FontAwesomeIcon
              icon={['fal', icon]}
              className="text-sm md:text-lg"
              fixedWidth
            />
          )}
        </div>
      ) : null}
      {recommended && !isSelected ? (
        <div className="absolute -right-1 -top-2 rotate-12 transform flex flex-col items-center justify-center md:-right-3 md:-top-2">
          <p className="text-sm mb-2 rounded bg-primary-300 dark:bg-gray-900 px-2">
            Recommended
          </p>
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
          'Choose between different ways of importing this content model to your Contentful space:',
        )}
      </h2>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <ImportChoiceItem
          choiceState={choiceState}
          value="oauth"
          title="Authenticate with Contentful"
          description="Securely authenticate with Contentful and select any of your spaces"
          icon="contentful"
          recommended
        >
          Authenticate with Contentful
        </ImportChoiceItem>
        <ImportChoiceItem
          choiceState={choiceState}
          value="manual"
          title="Enter details manually"
          description="You will need the Space ID + Management Token"
          icon="i-cursor"
        >
          Enter details manually
        </ImportChoiceItem>
      </div>
    </div>
  );
};

export default ImportChoice;
