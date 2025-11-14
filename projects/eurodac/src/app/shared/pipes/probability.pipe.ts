import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'probability', standalone: true, pure: true })
export class ProbabilityPipe implements PipeTransform {
  transform(
    value?: number | null,
    mode: 'ratio' | 'percent' = 'ratio'
  ): string {
    if (value == null) return '—';
    const pct = mode === 'percent' ? value : value * 100;
    return `${pct.toFixed(1)}%`;
  }
}
