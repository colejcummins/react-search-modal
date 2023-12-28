import * as peggy from 'peggy';

type Expression = UnaryExpression | AndExpression | OrExpression | KeyValueExpression | string;

type AndExpression = {and: Expression[]};
type OrExpression = {or: Expression[]};
type UnaryExpression = {not: Expression};

type KeyValueExpression = Record<string, NumberOperation | number | string>;

type NumberOp = 'lte' | 'lt' | 'gt' | 'gte';
type NumberOperation = Record<NumberOp, number>;

const grammar = `
Expression
  = AndExpression

AndExpression
  = _ head:OrExpression tail:(_ "AND" _ OrExpression)+ _ {
  	let accum = [head];
    tail.forEach((element) => {
    	accum.push(element[3]);
    });
    return {and: accum}
} / OrExpression

OrExpression
  = _ head:UnaryExpression tail:(_ "OR" _ UnaryExpression)+ _  {
  	let accum = [head];
    tail.forEach((element) => {
    	accum.push(element[3]);
    });
    return {or: accum}
} / UnaryExpression

UnaryExpression
  = _ "NOT" _ exp:Expression
{
  return {not: exp}
} / BracketExpression

BracketExpression
  = _ "(" _ exp:Expression _ ")" _
{
  return exp
} / KeyValue

KeyValue
  = _ key:([0-9a-zA-Z_]+) ":" value:Value _ { return {[key.join('')]: value} } / String

NumberOp
  = op:("<=" / ">=" / "<" / ">")
{
	switch (op) {
    	case '<=': return 'lte';
        case '>=': return 'gte';
        case '<': return 'lt';
        case '>': return 'gt';
    }
}

Value
  = NumberOperation / String;

NumberOperation
  = op:(NumberOp)? value:Number
{
  return op ? {[op]: value} : value
}

String
  = DoubleQuoteString / SingleQuoteString / RawString;

DoubleQuoteString
  = '"' str:([^"]*) '"' { return str.join('') }

SingleQuoteString
  = "'" str:([^']*) "'" { return str.join('') }

RawString
  = [^ "'>=<()]* { return text() }

Number
  = _ [-+]?[0-9]+(.[0-9]+)? { return parseFloat(text()); }

_ "whitespace"
  = [ \\t\\n\\r]*
`;

export const parser = peggy.generate(grammar);