// string replace function that uses promises

export = async function replace(
  string: string,
  pattern: RegExp,
  replacer: (match: string) => Promise<string>
): Promise<string> {
  const replacements: string[] = [];

  for (const match of string.match(pattern)) {
    replacements.push(await replacer(match));
  }

  return string.replace(pattern, () => replacements.shift());
};
