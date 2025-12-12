import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AlertRequestDto } from '@shared/models/alert/command/alert-request.model';
import {
  AlertResponseDto,
  AlertFilterOptions,
  RuleGroup,
  RuleClause,
} from '@shared/models/alert/query/alert-response.model';
import { AlertRepositoryService } from '@shared/services/alert-repository.service';

@Injectable()
export class AlertasService {
  private readonly alertRepository = inject(AlertRepositoryService);

  getSexList = toSignal(this.alertRepository.getAlertSexList(), {
    initialValue: [],
  });

  getDocTypeList = toSignal(this.alertRepository.getAlertDocTypeList(), {
    initialValue: [],
  });

  getCountryList = toSignal(this.alertRepository.getAlertCountryList(), {
    initialValue: [],
  });

  getAvailableFields = toSignal(this.alertRepository.getAlertFieldNames(), {
    initialValue: [],
  });

  // ==================== CRUD Operations ====================

  getAlertas(filter?: AlertFilterOptions): Observable<AlertResponseDto[]> {
    // return this.alertRepository
    //   .getAll()
    //   .pipe(map((alerts) => alerts.map((alert) => this.deserializeAlert(alert))));
    return this.alertRepository.getAll();
  }

  getById(id: string): Observable<AlertResponseDto> {
    // return this.alertRepository.getById(id).pipe(map((alert) => this.deserializeAlert(alert)));
    return this.alertRepository.getById(id);
  }

  create(alerta: AlertRequestDto): Observable<AlertResponseDto> {
    const payload = this.serializeRules(alerta);
    // return this.alertRepository.create(payload).pipe(map((alert) => this.deserializeAlert(alert)));
    return this.alertRepository.create(payload);
  }

  update(id: string, alerta: AlertRequestDto): Observable<AlertResponseDto> {
    const payload = this.serializeRules(alerta);
    // return this.alertRepository
    //   .update(id, payload)
    //   .pipe(map((alert) => this.deserializeAlert(alert)));
    return this.alertRepository.update(id, payload);
  }

  delete(id: string): Observable<void> {
    return this.alertRepository.delete(id);
  }

  // ==================== Serialization / Deserialization ====================

  /**
   * Serialize front-end rule tree to backend JSON format
   */
  serializeRules(alerta: AlertRequestDto): AlertRequestDto {
    const serializedAlerta = new AlertRequestDto(alerta);

    if (alerta.ruleGroup) {
      serializedAlerta.filtersAQL = this.serializeRule(alerta.ruleGroup);
      console.log('Resulting AQL string :::====::: ', serializedAlerta.filtersAQL);
    }

    return serializedAlerta;
  }

  private serializeRule(rule: RuleGroup): string {
    const mapOp = (op: 'AND' | 'OR') => (op === 'AND' ? 'Y' : 'O');

    const formatValue = (value: any): string => {
      if (Array.isArray(value)) {
        return `(${value.join(',')})`;
      }
      if (typeof value === 'string') {
        return `'${value}'`;
      }

      if (typeof value === 'number') {
        return `${value}`;
      }

      if (!isNaN(Date.parse(value))) {
        return value.toISOString().substring(0, 10);
      }

      return `${value}`;
    };

    const serializeClause = (clause: RuleClause): string => {
      return `${clause.field} ${clause.operator} ${formatValue(clause.value)}`;
    };

    const serializeGroup = (group: RuleGroup): string => {
      if (!group.children?.length) return '';

      const parts: string[] = [];
      const logic = mapOp(group.operator);

      group.children.forEach((child, index) => {
        const prefix = index > 0 ? ` ${logic} ` : '';

        if ('children' in child) {
          const nested = serializeGroup(child);
          parts.push(prefix + `(${nested})`);
        } else {
          parts.push(prefix + serializeClause(child));
        }
      });

      return parts.join('');
    };

    if ('children' in rule) {
      return serializeGroup(rule);
    }

    return serializeClause(rule);
  }

  /**
   * Deserialize backend JSON format to front-end rule tree
   */
  deserializeAlert(alert: AlertResponseDto): AlertResponseDto {
    const deserializedAlert = new AlertResponseDto(alert);

    if (alert.filtersAQL) {
      try {
        deserializedAlert.ruleGroup = this.deserializeRule(alert.filtersAQL) as RuleGroup;
      } catch (error) {
        deserializedAlert.ruleGroup = { operator: 'AND', children: [] };
      }
    }

    return deserializedAlert;
  }

  deserializeRule(input: string): RuleGroup | RuleClause {
    const tokenize = (str: string): string[] => {
      const tokens: string[] = [];
      let buffer = '';

      const push = () => {
        if (buffer.trim()) tokens.push(buffer.trim());
        buffer = '';
      };

      for (const c of str) {
        if (c === '(' || c === ')') {
          push();
          tokens.push(c);
        } else if (c === ' ') {
          push();
        } else {
          buffer += c;
        }
      }
      push();
      return tokens;
    };

    const tokens = tokenize(input);
    let i = 0;

    const peek = () => tokens[i];
    const next = () => tokens[i++];

    const mapLogic = (t: string) => (t === 'Y' ? 'AND' : 'OR');

    const parseArray = (inner: string): any[] => {
      return inner.split(',').map((s) => {
        const item = s.trim();
        if (
          (item.startsWith('"') && item.endsWith('"')) ||
          (item.startsWith("'") && item.endsWith("'"))
        ) {
          return item.slice(1, -1);
        }
        if (!isNaN(Number(item))) return Number(item);
        return item;
      });
    };

    const parseValue = (token: string): any => {
      if (!token) return token;

      if (token.startsWith('(') && token.endsWith(')')) {
        const inner = token.slice(1, -1);
        if (inner.trim() === '') return [];
        return parseArray(inner);
      }

      if (
        (token.startsWith("'") && token.endsWith("'")) ||
        (token.startsWith('"') && token.endsWith('"'))
      ) {
        return token.slice(1, -1);
      }

      if (!isNaN(Number(token))) {
        return Number(token);
      }

      if (!isNaN(Date.parse(token))) {
        return new Date(token);
      }

      return token;
    };

    const OPERATORS = [
      'En',
      'No en',
      'Contiene',
      'No contiene',
      'Comienza con',
      'Termina con',
      '<>',
      '=',
      '>',
      '<',
      '>=',
      '<=',
    ];

    const parseClause = (): RuleClause => {
      const field = next();

      let opParts = [next()];

      let merged = opParts.join(' ');
      let lookaheadIndex = i;

      while (lookaheadIndex < tokens.length) {
        const attempt = merged + ' ' + tokens[lookaheadIndex];
        if (OPERATORS.includes(attempt)) {
          opParts.push(tokens[lookaheadIndex]);
          merged = attempt;
          lookaheadIndex++;
          i = lookaheadIndex;
        } else break;
      }

      const operator = merged;

      let valueToken = next();

      if (valueToken === '(') {
        const innerParts: string[] = [];
        while (i < tokens.length && peek() !== ')') {
          innerParts.push(next());
        }
        if (peek() === ')') next();
        valueToken = '(' + innerParts.join('') + ')';
      }

      return {
        field,
        operator,
        value: parseValue(valueToken),
      };
    };

    const parseGroup = (): RuleGroup | RuleClause => {
      const children: (RuleGroup | RuleClause)[] = [];
      let logicOp: 'AND' | 'OR' | null = null;

      while (i < tokens.length) {
        const t = peek();

        if (t === ')') {
          next();
          break;
        }

        let element: RuleGroup | RuleClause;

        if (t === '(') {
          next();
          element = parseGroup();
        } else {
          element = parseClause();
        }

        children.push(element);

        if (peek() === 'Y' || peek() === 'O') {
          const logicToken = next();
          logicOp = mapLogic(logicToken);
        }
      }

      if (children.length === 1 && !logicOp) {
        return {
          operator: logicOp ?? 'AND',
          children: children,
        };
      }

      return {
        operator: logicOp ?? 'AND',
        children,
      };
    };

    return parseGroup();
  }

  // ==================== Helper Methods ====================

  private isRuleClause(item: RuleGroup | RuleClause): item is RuleClause {
    return 'field' in item;
  }

  /**
   * Get logical operators for rule groups
   */
  getLogicalOperators(): { label: string; value: 'AND' | 'OR' }[] {
    return [
      { label: 'Y (AND)', value: 'AND' },
      { label: 'O (OR)', value: 'OR' },
    ];
  }

  // ==================== Validation ====================

  /**
   * Validate rule group recursively
   */
  validateRuleGroup(group: RuleGroup): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!group.operator) {
      errors.push('El operador del grupo es obligatorio');
    }

    if (!group.children || group.children.length === 0) {
      errors.push('El grupo debe tener al menos una condición o subgrupo');
    }

    group.children.forEach((child, index) => {
      if (this.isRuleClause(child)) {
        const clauseValidation = this.validateRuleClause(child, index);
        errors.push(...clauseValidation.errors);
      } else {
        const groupValidation = this.validateRuleGroup(child);
        errors.push(...groupValidation.errors);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate individual rule clause
   */
  validateRuleClause(clause: RuleClause, index: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!clause.field) {
      errors.push(`Condición ${index + 1}: El campo es obligatorio`);
    }

    if (!clause.operator) {
      errors.push(`Condición ${index + 1}: El operador es obligatorio`);
    }

    // Only validate value if operator requires it (some operators like IS_EMPTY don't need a value)
    const operatorsWithoutValue = ['Esta vacio', 'No esta vacio'];
    if (!operatorsWithoutValue.includes(clause.operator)) {
      if (clause.value === undefined || clause.value === null || clause.value === '') {
        errors.push(`Condición ${index + 1}: El valor es obligatorio`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
