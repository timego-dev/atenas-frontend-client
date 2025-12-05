// src/app/shared/parsers/aql-parser.ts
export type AstNode = BinaryNode | ComparisonNode | GroupNode;

export class BinaryNode {
  operator!: string; // "Y" or "O"
  left!: AstNode;
  right!: AstNode;
}

export class ComparisonNode {
  field: string = '';
  operator: string = '';
  value?: any;
  values?: any[];
}

export class GroupNode {
  inner!: AstNode;
}

// Token kinds
enum TokKind {
  Identifier = 'Identifier',
  String = 'String',
  Number = 'Number',
  Operator = 'Operator',
  Keyword = 'Keyword',
  LParen = 'LParen',
  RParen = 'RParen',
  Comma = 'Comma',
  End = 'End',
}
type Token = { kind: TokKind; text: string; pos: number };

// Public API
export namespace AqlParser {
  export function tryParse(
    input: string
  ): { success: true; ast: AstNode } | { success: false; error: string } {
    if (input == null) input = '';
    try {
      const tokens = tokenize(input);
      const p = new Parser(tokens);
      const ast = p.parseExpression();
      if (!p.atEnd()) {
        return {
          success: false,
          error: `Unexpected token at position ${p.currentPos}: '${p.current().text}'`,
        };
      }
      return { success: true, ast };
    } catch (ex: any) {
      return { success: false, error: ex?.message ?? String(ex) };
    }
  }
}

// ---------- Tokenizer ----------
function tokenize(input: string): Token[] {
  const out: Token[] = [];
  let pos = 0;
  const len = input.length;

  const peekChar = () => (pos < len ? input[pos] : '\0');
  const isEnd = () => pos >= len;
  const skipWhite = () => {
    while (!isEnd() && /\s/.test(peekChar())) pos++;
  };

  while (!isEnd()) {
    skipWhite();
    if (isEnd()) break;
    const start = pos;
    const c = peekChar();

    if (c === '(') {
      out.push({ kind: TokKind.LParen, text: '(', pos: start });
      pos++;
      continue;
    }
    if (c === ')') {
      out.push({ kind: TokKind.RParen, text: ')', pos: start });
      pos++;
      continue;
    }
    if (c === ',') {
      out.push({ kind: TokKind.Comma, text: ',', pos: start });
      pos++;
      continue;
    }

    // strings
    if (c === '"' || c === "'") {
      const q = c;
      pos++;
      let acc = '';
      while (!isEnd() && peekChar() !== q) {
        if (peekChar() === '\\' && pos + 1 < len) {
          pos++;
          acc += peekChar();
          pos++;
        } else {
          acc += peekChar();
          pos++;
        }
      }
      if (isEnd()) throw new Error(`Unterminated string starting at ${start}`);
      pos++; // closing
      out.push({ kind: TokKind.String, text: acc, pos: start });
      continue;
    }

    // operators like <>, <=, >=, =, <, >
    if (c === '<' || c === '>' || c === '=') {
      if (c === '<' && pos + 1 < len && input[pos + 1] === '>') {
        out.push({ kind: TokKind.Operator, text: '<>', pos: start });
        pos += 2;
        continue;
      }
      if (pos + 1 < len && input[pos + 1] === '=') {
        out.push({ kind: TokKind.Operator, text: input.substr(pos, 2), pos: start });
        pos += 2;
        continue;
      }
      out.push({ kind: TokKind.Operator, text: input[pos], pos: start });
      pos++;
      continue;
    }

    // identifiers or keywords (also handles multi-word "No en", "No contiene")
    if (/[A-Za-z]/.test(c)) {
      const s = pos;
      while (pos < len && /[A-Za-z0-9_]/.test(input[pos])) pos++;
      const word = input.substring(s, pos);
      // lookahead for multi-word "No en" / "No contiene"
      const save = pos;
      skipWhite();
      if (/^No$/i.test(word) && pos < len) {
        const s3 = pos;
        while (pos < len && /[A-Za-z0-9_]/.test(input[pos])) pos++;
        if (pos > s3) {
          const nextWord = input.substring(s3, pos);
          if (/^en$/i.test(nextWord) || /^contiene$/i.test(nextWord)) {
            out.push({ kind: TokKind.Keyword, text: `No ${nextWord}`, pos: start });
            continue;
          }
        }
        pos = save;
      }
      // single-word keyword check
      const normalized = normalizeKeyword(word);
      if (normalized.isKeyword) {
        out.push({ kind: TokKind.Keyword, text: normalized.normalized, pos: start });
      } else {
        out.push({ kind: TokKind.Identifier, text: word, pos: start });
      }
      continue;
    }

    // numbers
    if (/\d/.test(c)) {
      const s = pos;
      while (pos < len && /[\d.]/.test(input[pos])) pos++;
      out.push({ kind: TokKind.Number, text: input.substring(s, pos), pos: start });
      continue;
    }

    throw new Error(`Unexpected char '${c}' at position ${pos}.`);
  }

  out.push({ kind: TokKind.End, text: '', pos });
  return out;
}

function normalizeKeyword(word: string): { isKeyword: boolean; normalized: string } {
  switch (word.toUpperCase()) {
    case 'Y':
      return { isKeyword: true, normalized: 'Y' };
    case 'O':
      return { isKeyword: true, normalized: 'O' };
    case 'EN':
      return { isKeyword: true, normalized: 'En' };
    case 'CONTIENE':
      return { isKeyword: true, normalized: 'Contiene' };
    default:
      return { isKeyword: false, normalized: word };
  }
}

// ---------- Parser ----------
class Parser {
  tokens: Token[];
  i: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.i = 0;
  }

  current(): Token {
    return this.tokens[this.i];
  }
  atEnd(): boolean {
    return this.current().kind === TokKind.End;
  }
  currentPos(): number {
    return this.current().pos;
  }

  parseExpression(): AstNode {
    return this.parseOr();
  }

  parseOr(): AstNode {
    let left = this.parseAnd();
    while (this.matchKeyword('O')) {
      const right = this.parseAnd();
      const b = new BinaryNode();
      b.operator = 'O';
      b.left = left;
      b.right = right;
      left = b;
    }
    return left;
  }

  parseAnd(): AstNode {
    let left = this.parsePrimary();
    while (this.matchKeyword('Y')) {
      const right = this.parsePrimary();
      const b = new BinaryNode();
      b.operator = 'Y';
      b.left = left;
      b.right = right;
      left = b;
    }
    return left;
  }

  parsePrimary(): AstNode {
    if (this.matchKind(TokKind.LParen)) {
      const inside = this.parseExpression();
      this.expect(TokKind.RParen, "Expected closing ')'");
      const g = new GroupNode();
      g.inner = inside;
      return g;
    }
    return this.parseComparisonOrInOrContains();
  }

  parseComparisonOrInOrContains(): AstNode {
    const idTok = this.expect(TokKind.Identifier, 'Expected field name');
    const field = idTok.text;

    if (this.current().kind === TokKind.Operator) {
      const op = this.current().text;
      this.advance();
      const val = this.parseValue();
      const c = new ComparisonNode();
      c.field = field;
      c.operator = op;
      c.value = val;
      return c;
    }

    if (this.matchKeyword('En')) {
      this.expect(TokKind.LParen, "Expected '(' after En");
      const values: any[] = [];
      values.push(this.parseValue());
      while (this.matchKind(TokKind.Comma)) {
        values.push(this.parseValue());
      }
      this.expect(TokKind.RParen, "Expected ')' after list");
      const c = new ComparisonNode();
      c.field = field;
      c.operator = 'En';
      c.values = values;
      return c;
    }

    if (this.matchKeyword('No en')) {
      this.expect(TokKind.LParen, "Expected '(' after No en");
      const values: any[] = [];
      values.push(this.parseValue());
      while (this.matchKind(TokKind.Comma)) {
        values.push(this.parseValue());
      }
      this.expect(TokKind.RParen, "Expected ')' after list");
      const c = new ComparisonNode();
      c.field = field;
      c.operator = 'No en';
      c.values = values;
      return c;
    }

    if (this.matchKeyword('Contiene')) {
      const val = this.parseValue();
      const c = new ComparisonNode();
      c.field = field;
      c.operator = 'Contiene';
      c.value = val;
      return c;
    }

    if (this.matchKeyword('No contiene')) {
      const val = this.parseValue();
      const c = new ComparisonNode();
      c.field = field;
      c.operator = 'No contiene';
      c.value = val;
      return c;
    }

    throw new Error(`Expected operator after field '${field}' at position ${this.currentPos()}`);
  }

  parseValue(): any {
    if (this.matchKind(TokKind.String)) {
      return this.tokens[this.i - 1].text;
    }
    if (this.matchKind(TokKind.Number)) {
      const txt = this.tokens[this.i - 1].text;
      if (txt.indexOf('.') >= 0) {
        const d = Number.parseFloat(txt);
        return Number.isNaN(d) ? txt : d;
      } else {
        const l = Number.parseInt(txt, 10);
        return Number.isNaN(l) ? txt : l;
      }
    }
    if (this.matchKind(TokKind.Identifier)) {
      const t = this.tokens[this.i - 1].text;
      if (/^true$/i.test(t)) return true;
      if (/^false$/i.test(t)) return false;
      return t;
    }
    throw new Error(`Expected value at position ${this.currentPos()}`);
  }

  // helpers
  matchKind(k: TokKind): boolean {
    if (this.current().kind === k) {
      this.advance();
      return true;
    }
    return false;
  }
  matchKeyword(keyword: string): boolean {
    if (
      this.current().kind === TokKind.Keyword &&
      this.current().text.toLowerCase() === keyword.toLowerCase()
    ) {
      this.advance();
      return true;
    }
    return false;
  }

  expect(k: TokKind, message: string): Token {
    if (this.current().kind === k) {
      const t = this.current();
      this.advance();
      return t;
    }
    throw new Error(`${message} at position ${this.current().pos}`);
  }

  advance() {
    if (!this.atEnd()) this.i++;
  }

  atEndPublic() {
    return this.atEnd();
  } // (not used externally)
  atEndPublicName() {
    return this.atEnd();
  } // placeholder
}
