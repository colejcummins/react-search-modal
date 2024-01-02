type TokenType = 'key' | 'value' | 'operation' | 'string' | 'paren';

export type Token = {
  start: number;
  end: number;
  value: string;
  type: TokenType;
}

const splitStringsQuoteAware = (input: string): Token[] => {
  // Split strings, ignore spaces in single or double quotes, capture all parenthesis in capture groups 1 or 3.
  const regex = /(\(*)([^\s()"']+|"[^"]*"?|'[^']*'?)(\)*)/g;

  const tokens: Token[] = [];
  let result: RegExpExecArray | null = null;
  while ((result = regex.exec(input)) !== null) {
    // add open parenthesis to the tokens list
    if (result[1]) {
      tokens.push({
        value: result[1],
        start: result.index,
        end: result.index + result[1].length,
        type: 'paren'
      })
    }
    // add words to the tokens list
    tokens.push({
      value: result[2],
      start: result.index + result[1].length,
      end: result.index + result[1].length + result[2].length,
      type: 'string',
    });
    // add closing parenthesis to the tokens list
    if (result[3]) {
      tokens.push({
        value: result[3],
        start: result.index + result[1].length + result[2].length,
        end: result.index + result[1].length + result[2].length + result[3].length,
        type: 'paren'
      })
    }
  }

  return tokens;
}

export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];

  const unparsedTokens = splitStringsQuoteAware(input);

  let i = 0;
  while (i < unparsedTokens.length) {
    const {start, end, value} = unparsedTokens[i];
    if (['NOT', 'OR', 'AND'].includes(value)) {
      tokens.push({...unparsedTokens[i], type: 'operation'});
    }
    // if the word contains a ':' character, split word into key and value
    else if (value.includes(':')) {
      const keyEnd = value.indexOf(':');
      if (keyEnd === value.length - 1) {
        tokens.push({...unparsedTokens[i], type: 'key'});
        if (i + 1 < unparsedTokens.length && unparsedTokens[i + 1].start === unparsedTokens[i].end) {
          tokens.push({...unparsedTokens[i + 1], type: 'value'});
          i += 1;
        }
      } else {
        const keyHalf = value.slice(0, keyEnd + 1);
        const valueHalf = value.slice(keyEnd + 1);
        tokens.push({start, end: start + keyHalf.length + 1, value: keyHalf, type: 'key'});
        tokens.push({start: start + keyHalf.length + 1, end, value: valueHalf, type: 'value'});
      }
    } else {
      tokens.push(unparsedTokens[i]);
    }
    i += 1;
  }

  return tokens;
};
