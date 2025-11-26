import { Component, input } from '@angular/core';
import { CaseResolution, CaseStatus } from '@shared/models/case/case.enums';
import { CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'lib-estado-consulta',
  imports: [TagModule],
  template: `
    @switch (consulta().caseStatus) { @case (EstadoConsulta.OPEN) {
    <p-tag severity="info" value="En curso" />
    } @case (EstadoConsulta.PENDING) {
    <p-tag severity="warn" value="Pendiente" />
    } @case (EstadoConsulta.SOLVED) { @switch (consulta().caseResolution) { @case
    (RespuestaConsulta.WITHOUT_EVIDENCES) {
    <p-tag severity="success" value="Sin evidencias de falsificación" />
    } @case (RespuestaConsulta.WITH_EVIDENCES) {
    <p-tag severity="danger" value="Con evidencias de falsificación" />
    } @case (RespuestaConsulta.INSUFFICIENT_QUALITY) {
    <p-tag severity="secondary" value="Calidad insuficiente" />
    } @case (RespuestaConsulta.INVALID_DOCUMENT) {
    <p-tag severity="secondary" value="Documento no válido" />
    }} } }
  `,
})
export class EstadoConsultaComponent {
  consulta = input.required<CaseSummaryDto>();
  EstadoConsulta = CaseStatus;
  RespuestaConsulta = CaseResolution;
}
