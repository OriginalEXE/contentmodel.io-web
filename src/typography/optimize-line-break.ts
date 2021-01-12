const optimizeLineBreak = (
  str: string,
  { force = true }: { force: boolean } = { force: false },
): string => {
  const tokens = str.split(' ');

  if (tokens.length < 3 && force === false) {
    return str;
  }

  const lastToken = tokens.pop();

  return `${tokens.join(' ')}\u00A0${lastToken}`;
};

export default optimizeLineBreak;
