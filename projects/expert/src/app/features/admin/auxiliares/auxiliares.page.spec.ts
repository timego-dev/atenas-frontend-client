import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
  AuthMockService,
  AuthService,
  AuxiliarRepositoryMockService,
  AuxiliarRepositoryService,
} from '@shared';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuxiliaresPage } from './auxiliares.page';
import { AuxiliarRequestDto } from '@shared/models/auxiliar/command/auxiliar-request.model';
import { FieldType } from '@shared/models/auxiliar/query/auxiliar-response.model';

describe('Auxiliars page', () => {
  let auxiliaresPage: AuxiliaresPage;
  let fixture: ComponentFixture<AuxiliaresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [],
      providers: [
        { provide: AuxiliarRepositoryService, useClass: AuxiliarRepositoryMockService },
        { provide: AuthService, useClass: AuthMockService },
        provideNoopAnimations(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuxiliaresPage);
    auxiliaresPage = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  describe('Page tests', () => {
    it('should be in initial state', () => {
      expect(auxiliaresPage.auxiliares.length).toBe(0);
      expect(auxiliaresPage.editDialog).toBeFalse();
      expect(auxiliaresPage.editAuxiliar).toBeDefined;

      // TODO: comprovar que s'han llegit 4 camps auxiliars

      // TODO: comprovar que estan per ordre alfabètic pel camp "alias"

      // TODO: comprovar que hi ha 3 que son requerits
    });

    it('should add a new auxiliar', fakeAsync(() => {
      auxiliaresPage.openNew();
      fixture.detectChanges();
      tick();
      expect(auxiliaresPage.editDialog).toBeTrue();
      expect(auxiliaresPage.editingAuxiliar).toBeDefined();

      expect(auxiliaresPage.editDialogComponent()).toBeDefined();
      auxiliaresPage.editDialogComponent()!.auxiliar().alias = 'Filemon';
      auxiliaresPage.editDialogComponent()!.auxiliar().title = 'Heroe';
      auxiliaresPage.editDialogComponent()!.auxiliar().maxLength = 20;
      fixture.detectChanges();
      tick();

      auxiliaresPage.guardar();
      fixture.detectChanges();
      tick();
      expect(auxiliaresPage.editDialog).toBeFalse();
      expect(auxiliaresPage.auxiliares().length).toBe(5);
    }));

    it('should edit auxiliar', fakeAsync(() => {
      const auxiliar = auxiliaresPage.auxiliares()[0];
      auxiliaresPage.editAuxiliar(auxiliar);
      fixture.detectChanges();
      tick();

      expect(auxiliaresPage.editDialog).toBeTrue();
      expect(auxiliaresPage.selectedAuxiliar).toEqual(auxiliar);

      expect(auxiliaresPage.editDialogComponent()).toBeDefined();

      auxiliaresPage.editDialogComponent()!.auxiliar().alias = 'Mortadelo';
      auxiliaresPage.editDialogComponent()!.auxiliar().type = FieldType.Text;
      auxiliaresPage.editDialogComponent()!.auxiliar().maxLength = 20;

      fixture.detectChanges();
      tick();
      expect(auxiliaresPage.editingAuxiliar!.alias).toBe('Mortadelo');
      expect(auxiliaresPage.editingAuxiliar!.maxLength).toBe(20);

      // buttonGuardar.click();
      auxiliaresPage.guardar();

      fixture.detectChanges();
      tick();
      expect(auxiliaresPage.editDialog).toBeFalse();

      expect(auxiliaresPage.auxiliares()[0].alias).toBe('Mortadelo');
      expect(auxiliaresPage.auxiliares()[0].type).toBe(FieldType.Text);
      expect(auxiliaresPage.auxiliares()[0].maxLength).toBe(20);
    }));
  });
});
