import React from 'react';
import styled from '@emotion/styled';

import {tokenize, Token} from '../lib';

const Input = styled.input(() => ({
  fontSize: '14px',
}));

const ValueToken = styled.div(() => ({
  color: 'rgb(16, 177, 254)',
  backgroundColor: 'rgba(16, 177, 254, 0.3)',
  borderRadius: '4px',
}));

const OperatorToken = styled.div(() => ({
  color: '#9f7efe',
}));

export const SearchInput = ({}) => {
  const [internalValue, setInternalValue] = React.useState('');

  const tokens = React.useMemo(() => tokenize(internalValue), [internalValue]);

  const renderGap = (value: string) => {
    return (
      <div>
        {value}
      </div>
    );
  }

  const renderValue = (value: string) => {
    return <ValueToken>{value}</ValueToken>;
  }

  const renderOperator = (operator: string) => {
    return <OperatorToken>{operator}</OperatorToken>
  }

  const renderTokens = (tokens: Token[], internalValue: string) => {
    const output: JSX.Element[] = [];
    for (let i = 0; i < tokens.length; i += 1) {
      if (i + 1 < tokens.length && tokens[i].end !== tokens[i + 1].start) {
        output.push(renderGap(internalValue.slice(tokens[i].end + 1, tokens[i + 1].start)));
      }
      if (tokens[i].type === 'value') {
        output.push(renderValue(tokens[i].value));
      } else if (tokens[i].type === 'operation') {
        output.push(renderOperator(tokens[i].value));
      } else {
        output.push(renderGap(tokens[i].value));
      }
      console.log(output);
    }
    return output;
  }


  return (
    <div>
      <Input
        type='text'
        value={internalValue}
        onChange={(evt) => setInternalValue(evt.target.value)}
      />
      <div>
        {renderTokens(tokens, internalValue)}
      </div>
    </div>
  )
}