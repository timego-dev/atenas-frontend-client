import { Component, input } from '@angular/core';
import { CaseResolution, CaseStatus } from '@shared/models/case/case.enums';
import { CaseSummaryDto } from '@shared/models/case/query/case.dto';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'lib-estado-consulta',
  imports: [TagModule],
  template: `
    @switch (consulta().caseStatus) { @case (EstadoConsulta.CLARIFICATION_PENDING) {
    <p-tag severity="warn" value="Requiere más información" />
    } @case (EstadoConsulta.ARCHIVED) {
    <p-tag severity="success" value="Archivado" />
    } @case (EstadoConsulta.OPEN) {
    <p-tag severity="secondary" value="Nuevo" />
    } @case (EstadoConsulta.PENDING) {
    <p-tag severity="info" value="Pendiente" />
    } @case (EstadoConsulta.SOLVED) { @switch (consulta().caseResolution) { @case
    (RespuestaConsulta.WITHOUT_EVIDENCES) {
    <p-tag severity="success" value="Sin evidencias de falsificación" />
    } @case (RespuestaConsulta.WITH_EVIDENCES) {
    <p-tag severity="danger" value="Con evidencias de falsificación" />
    } @case (RespuestaConsulta.INSUFFICIENT_QUALITY) {
    <p-tag severity="warn" value="Calidad insuficiente" />
    } @case (RespuestaConsulta.INVALID_DOCUMENT) {
    <p-tag severity="warn" value="Documento no válido" />
    }} } }
  `,
})
export class EstadoConsultaComponent {
  consulta = input.required<CaseSummaryDto>();
  EstadoConsulta = CaseStatus;
  RespuestaConsulta = CaseResolution;
}
