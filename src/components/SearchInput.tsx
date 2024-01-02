import React from 'react';
import styled from '@emotion/styled';

import {tokenize, Token} from '../lib';

const Input = styled.input(() => ({
  fontSize: '16px',
  position: 'absolute',
  color: 'transparent',
  backgroundColor: 'transparent',
  caretColor: 'black',
  flex: 1,
  border: 'none',
  outline: 'none',
  padding: 'unset',
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

  const renderGap = (i: number) => {
    return Array(i).fill(<div>&nbsp;</div>);
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
      if (tokens[i].type === 'value') {
        output.push(renderValue(tokens[i].value));
      } else if (tokens[i].type === 'operation') {
        output.push(renderOperator(tokens[i].value));
      } else {
        output.push(<div>{tokens[i].value}</div>);
      }
      if (i + 1 < tokens.length && tokens[i].end !== tokens[i + 1].start) {
        output.push(...renderGap(tokens[i + 1].start - tokens[i].end));
      }
    }
    return output;
  }


  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          fontFamily: 'Arial',
          fontSize: '16px',
        }}
      >
        {renderTokens(tokens, internalValue)}
      </div>
      <Input
        type='text'
        value={internalValue}
        onChange={(evt) => setInternalValue(evt.target.value)}
      />
    </div>
  )
}