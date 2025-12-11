import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService, AuxiliarRepositoryMockService, AuxiliarRepositoryService } from '@shared';
import { AuthMockService } from '@shared/services/mock/auth-mock.service';
import {
  AuxiliarRequestDto,
  AuxiliarRequestOptionDto,
} from '@shared/models/auxiliar/command/auxiliar-request.model';
import {
  AuxiliarResponseDto,
  FieldType,
} from '@shared/models/auxiliar/query/auxiliar-response.model';
import { AuxiliaresService } from './auxiliares.service';
describe('Auxiliares services', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: AuxiliarRepositoryService, useClass: AuxiliarRepositoryMockService },
        { provide: AuthService, useClass: AuthMockService, AuxiliaresService },
      ],
    }).compileComponents();
  });

  // TODO: Afegir test per service.getAuxiliares

  // TODO: Afegir test per service.getById

  //CREATE
  it('should create an auxiliary (text)', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    //FIELDTYPE TEXT
    const newAux: AuxiliarRequestDto = {
      alias: 'primero',
      title: 'segundo',
      type: FieldType.Text,
      required: false,
      maxLength: 20,
      options: [],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.create(newAux).subscribe((a) => {
      auxResponse = a;
    });
    tick();

    expect(auxResponse.alias).toBe('primero');
    expect(auxResponse.title).toBe('segundo');
    expect(auxResponse.maxLength).toBe(20);
  }));

  it('should create an auxiliary (integer)', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    //FIELDTYPE INTEGER
    const newAux: AuxiliarRequestDto = {
      alias: 'dolar',
      title: 'eeuu',
      type: FieldType.Integer,
      required: false,
      minValue: 0,
      maxValue: 1000,
      options: [],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.create(newAux).subscribe((a) => {
      auxResponse = a;
    });
    tick();

    expect(auxResponse.alias).toBe('dolar');
    expect(auxResponse.minValue).toBe(0);
    expect(auxResponse.maxValue).toBe(1000);
  }));

  it('should create an auxiliary (decimal)', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    //FIELDTYPE DECIMAL
    const newAux: AuxiliarRequestDto = {
      alias: 'pesos',
      title: 'latam',
      type: FieldType.Numeric,
      required: false,
      minValue: 10,
      maxValue: 100,
      decimals: 0.5,
      options: [],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.create(newAux).subscribe((a) => {
      auxResponse = a;
    });
    tick();

    expect(auxResponse.alias).toBe('pesos');
    expect(auxResponse.minValue).toBe(10);
    expect(auxResponse.maxValue).toBe(100);
    expect(auxResponse.decimals).toBe(0.5);
  }));

  it('should create an auxiliary (currency euro)', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    //FIELDTYPE CURRENCY EURO
    const newAux: AuxiliarRequestDto = {
      alias: 'euro',
      title: 'europa',
      type: FieldType.CurrencyEuro,
      required: true,
      minValue: 10,
      maxValue: 200,
      decimals: 2,
      options: [],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.create(newAux).subscribe((a) => {
      auxResponse = a;
    });
    tick();

    expect(auxResponse.alias).toBeDefined;
    expect(auxResponse.minValue).toBe(10);
    expect(auxResponse.maxValue).toBe(200);
    expect(auxResponse.decimals).toBe(2);
  }));

  // TODO: Afegir el cas d'intentar crear un camp auxiliar amb un alias d'un que ja existeix. Ha de retornar http status 400

  it('should create an auxiliary (list)', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    const opciones: AuxiliarRequestOptionDto = {
      code: 'codigo',
      description: 'descripcion',
    };

    //FIELDTYPE LIST
    const newAux: AuxiliarRequestDto = {
      alias: 'moneda',
      title: 'bitcoin',
      type: FieldType.List,
      required: false,
      options: [opciones],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.create(newAux).subscribe((a) => {
      auxResponse = a;
    });
    tick();

    expect(auxResponse.options).toBeDefined;
    expect(auxResponse.alias).toBe('moneda');
    expect(auxResponse.title).toBe('bitcoin');
    expect(auxResponse.options?.map((a) => a.code)).toEqual(['codigo']);
  }));

  it('should create an auxiliary (error 400 unknow url)', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    const opciones: AuxiliarRequestOptionDto = {
      code: 'codigo',
      description: 'descripcion',
    };

    //EN CASO DE DEJAR LOS VALORES VACIOS ERROR 400
    const newAux: AuxiliarRequestDto = {
      alias: 'moneda',
      title: 'bitcoin',
      type: FieldType.Numeric,
      required: false,
      options: [],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.create(newAux).subscribe({
      next(value) {
        fail();
      },
      error(err: HttpErrorResponse) {
        expect(err.status).toBe(400);
      },
    });
    tick;
  }));

  //UPDATE
  it('should update an auxiliary', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    const newAux: AuxiliarRequestDto = {
      alias: 'policia',
      title: 'Jefe Policia',
      type: FieldType.Text,
      required: false,
      maxLength: 20,
      options: [],
    };

    let auxResponse!: AuxiliarResponseDto;

    service.getById('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe((a) => {
      auxResponse = a;
    });
    tick();

    service.update(auxResponse.id, newAux).subscribe((a) => {
      auxResponse = a;
    });
    tick();

    expect(auxResponse.alias).toEqual('policia');
    expect(auxResponse.type).toBe(FieldType.Text);
  }));

  //REMOVE
  it('should remove the auxiliary', fakeAsync(() => {
    const service = TestBed.inject(AuxiliaresService);

    let auxiliars!: AuxiliarResponseDto[];

    service.delete('08de26bb-4837-4fbc-81cb-5f32c24b1acc').subscribe(() => {});
    tick();

    service.getAuxiliares().subscribe((a) => {
      auxiliars = a;
    });
    tick();

    const aux = auxiliars.find((a) => a.id === '08de26bb-4837-4fbc-81cb-5f32c24b1acc');
    expect(aux).toBeUndefined;
    expect(auxiliars.length).toBe(3);
  }));

  // TODO: Afegir test d'intentar eliminar un camp auxilir que no existeix
});
