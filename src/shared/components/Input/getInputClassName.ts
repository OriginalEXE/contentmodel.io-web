interface GetInputClassNameInput {
  type: 'text' | 'textarea';
}

export const getInputClassName = (
  { type = 'text' }: GetInputClassNameInput = {
    type: 'text',
  },
): string => {
  if (type === 'text') {
    return 'appearance-none rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 w-full leading-loose p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2';
  }

  if (type === 'textarea') {
    return 'appearance-none rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 w-full leading-loose p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2';
  }

  return '';
};
