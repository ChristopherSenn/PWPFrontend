/**
 * 'Algorithm' to create a random string (taken from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=2&tab=votes#tab-top)
 */
const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomCharFromAlphabet(alphabet: string): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

function generatePassword(length: number): string {
  /**
   * Create n-long array and map it to random chars from given alphabet.
   * Then join individual chars as string
   */
  return Array.from({ length: length })
    .map(() => {
      return getRandomCharFromAlphabet(DEFAULT_ALPHABET);
    })
    .join('');
}

export { generatePassword };
