type TokenType = 'key' | 'value' | 'operation' | 'string' | 'paren';

export type Token = {
  start: number;
  end: number;
  value: string;
  type: TokenType;
}

const splitStringsQuoteAware = (input: string): Token[] => {
  const regex = /[^\s"']+|("[^"]*")|('[^']*')/g;

  const tokens: Token[] = [];
  let result: RegExpExecArray | null = null;
  while ((result = regex.exec(input)) !== null) {
    tokens.push({
      value: result[0],
      start: result.index,
      end: result.index + result[0].length,
      type: 'string',
    });
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
    else if (value.includes(':')) {
      const keyEnd = value.indexOf(':');
      if (keyEnd === value.length - 1) {
        tokens.push({...unparsedTokens[i], type: 'key'});
        if (i + 1 < unparsedTokens.length && unparsedTokens[i + 1].start === unparsedTokens[i].end) {
          tokens.push({...unparsedTokens[i + 1], type: 'value'});
          i += 1;
        }
      } else {
        const keyHalf = value.slice(0, keyEnd);
        const valueHalf = value.slice(keyEnd + 1);
        tokens.push({start, end: start + keyHalf.length, value: keyHalf, type: 'key'});
        tokens.push({start: start + keyHalf.length + 1, end, value: valueHalf, type: 'value'});
      }
    } else {
      tokens.push(unparsedTokens[i]);
    }
    i += 1;
  }

  return tokens;
};

const tokenize2 = (input: string) => {

}
