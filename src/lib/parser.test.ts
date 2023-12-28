import {parser} from './parser';

describe('parser' , () => {
  it('parses strings' , () => {
    expect(parser.parse('foo')).toBe('foo');
    expect(parser.parse('"foo bar"')).toBe('foo bar');
    expect(parser.parse("'foo bar'")).toBe('foo bar');
    expect(() => parser.parse('foo bar')).toThrow(parser.SyntaxError)
  });

  it('parses keyvalues', () => {
    expect(parser.parse('foo:bar')).toEqual({foo: 'bar'});
    expect(parser.parse('foo:"bar baz"')).toEqual({foo: 'bar baz'});
    expect(parser.parse('foo:5')).toEqual({foo: 5});
    expect(parser.parse('foo:-5.23')).toEqual({foo: -5.23});
  });

  it('parses number operations', () => {
    expect(parser.parse('foo:<4')).toEqual({foo: {lt: 4}});
    expect(parser.parse('foo:<=4')).toEqual({foo: {lte: 4}});
    expect(parser.parse('foo:>4')).toEqual({foo: {gt: 4}});
    expect(parser.parse('foo:>=4')).toEqual({foo: {gte: 4}});
    expect(() => parser.parse('foo:>=nice')).toThrow(parser.SyntaxError);
  });

  it('parses boolean expressions', () => {
    expect(parser.parse('foo AND bar:baz')).toEqual({and: ['foo', {bar: 'baz'}]});
    expect(parser.parse('foo AND bar:baz AND baz:bar')).toEqual({and: ['foo', {bar: 'baz'}, {baz: 'bar'}]});
    expect(parser.parse('bar:baz OR baz:bar')).toEqual({or: [{bar: 'baz'}, {baz: 'bar'}]});
    expect(parser.parse('foo AND bar:baz OR baz:bar')).toEqual({and: ['foo', { or: [{bar: 'baz'}, {baz: 'bar'}]}]});
    expect(parser.parse('(foo AND bar:baz) OR naz:bar')).toEqual({or: [{and: ['foo', {bar: 'baz'}]}, {naz: 'bar'}]});
  });

  it('parses unary expressions', () => {
    expect(parser.parse('NOT foo')).toEqual({not: 'foo'});
    expect(parser.parse('NOT foo AND bar')).toEqual({not: {and: ['foo', 'bar']}});
    expect(parser.parse('(NOT foo AND bar:baz) OR naz:bar')).toEqual({or: [{not: {and: ['foo', {bar: 'baz'}]}}, {naz: 'bar'}]});
  });
});