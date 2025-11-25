import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UsuariosPage } from './usuarios.page';
import { UserRepositoryMockService, UserRepositoryService } from '@shared';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('Usuarios page', () => {
  let usuariosPage: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
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
      fixture.detectChanges();
      tick();
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

      textInputNombre.value = 'Nombre modificado';
      textInputNombre.dispatchEvent(new Event('input'));

      textInputEMail.value = 'email.modificado@email.com';
      textInputEMail.dispatchEvent(new Event('input'));

      // TODO: Completar campos restantes

      fixture.detectChanges();
      tick();
      expect(usuariosPage.usuario!.username).toBe('Nombre modificado');
      expect(usuariosPage.usuario!.email).toBe('email.modificado@email.com');

      buttonGuardar.click();

      fixture.detectChanges();
      tick();
      expect(usuariosPage.editDialog).toBeFalse();

      expect(usuariosPage.usuarios()[0].username).toBe('Nombre modificado');
      expect(usuariosPage.usuarios()[0].email).toBe('email.modificado@email.com');
    }));
  });
});
