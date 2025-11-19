import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import {
  EstadoConsulta,
  IConsulta,
  RespuestaConsulta,
} from '../../features/consultas/consultas.service';

@Component({
  selector: 'lib-estado-consulta',
  imports: [TagModule],
  template: `
    @switch (consulta().estado) { @case (EstadoConsulta.ASIGNADA) {
    <p-tag severity="info" value="En curso" />
    } @case (EstadoConsulta.PENDIENTE) {
    <p-tag severity="warn" value="Pendiente" />
    } @case (EstadoConsulta.RESUELTA) { @switch (consulta().respuesta) { @case
    (RespuestaConsulta.AUTENTICO) {
    <p-tag severity="success" value="Auténtico" />
    } @case (RespuestaConsulta.FALSO) {
    <p-tag severity="danger" value="Falso" />
    } @case (RespuestaConsulta.FALTA_INFORMACION) {
    <p-tag severity="secondary" value="Falta información" />
    } } } }
  `,
})
export class EstadoConsultaComponent {
  consulta = input.required<IConsulta>();
  EstadoConsulta = EstadoConsulta;
  RespuestaConsulta = RespuestaConsulta;
}
