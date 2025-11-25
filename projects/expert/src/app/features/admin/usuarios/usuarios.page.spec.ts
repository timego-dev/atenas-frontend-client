import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UsuariosPage } from './usuarios.page';
import { UserRepositoryMockService, UserRepositoryService } from '@shared';

import { importProvidersFrom } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('UsuariosPage', () => {
  let usuariosPage: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: UserRepositoryService, useClass: UserRepositoryMockService },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPage);
    usuariosPage = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  describe('Page tests', () => {
    it('should be in initial state', () => {
      expect(usuariosPage.usuarios().length).toBe(9);

      expect(usuariosPage.editDialog).toBeFalse();
      expect(usuariosPage.usuario).toBeUndefined();
    });

    it('should edit user', fakeAsync(() => {
      const usuario = usuariosPage.usuarios()[0];
      usuariosPage.editUser(usuario);
      tick();
      fixture.detectChanges();
      expect(usuariosPage.editDialog).toBeTrue();
      expect(usuariosPage.usuario).toEqual(usuario);

      const buttonGuardar = fixture.nativeElement.querySelector('p-button[label="Guardar"]');
      expect(buttonGuardar).toBeTruthy();
      const buttonCancelar = fixture.nativeElement.querySelector('p-button[label="Cancelar"]');
      expect(buttonCancelar).toBeTruthy();

      const textInputNombre = fixture.nativeElement.querySelector('input[id="nombre"]');
      expect(textInputNombre).toBeTruthy();
      expect(textInputNombre.value).toBe(usuario.username);

      const textInputEMail = fixture.nativeElement.querySelector('input[id="email"]');
      expect(textInputEMail).toBeTruthy();
      expect(textInputEMail.value).toBe(usuario.email);

      buttonGuardar.click();

      tick();
      fixture.detectChanges();
      expect(usuariosPage.editDialog).toBeFalse();
    }));
  });
});
