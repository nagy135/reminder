export const cutStringUntilChar = (str: string, char: string) => {
  const index = str.indexOf(char);
  if (index === -1) {
    return str;
  }
  return str.substring(0, index);
};
