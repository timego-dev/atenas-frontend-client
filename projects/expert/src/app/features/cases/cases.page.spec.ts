import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
  AuthMockService,
  AuthService,
  CaseRepositoryMockService,
  CaseRepositoryService,
} from '@shared';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CasesPage } from './cases.page';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { CaseResolution, CaseStatus, DocumentAttachmentType } from '@shared/models/case/case.enums';
import { CaseDto, CaseSummaryDto, UserSummaryDto } from '@shared/models/case/query/case.dto';
import { CaseFilters, CaseService, DateRangeFilter } from './case.service';
import { Button } from 'primeng/button';
import { SelectChangeEvent } from 'primeng/select';
dayjs.extend(relativeTime);
dayjs.locale('es');

describe('Cases page', () => {
  let casesPages: CasesPage;
  let fixture: ComponentFixture<CasesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [],
      providers: [
        { provide: CaseRepositoryService, useClass: CaseRepositoryMockService },
        { provide: AuthService, useClass: AuthMockService },
        provideNoopAnimations(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CasesPage);
    casesPages = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  describe('Case test', () => {
    it('should be in initial state', () => {
      expect(casesPages.caseList.length).toBe(100);
      expect(casesPages.editDialog).toBeFalse();
      expect(casesPages.case).toBeUndefined;
    });

    it('should press the add button', fakeAsync(() => {
      casesPages.clickCaseCreate();
      fixture.detectChanges();
      tick();
      expect(casesPages.createCaseDialog).toBeTrue();
      expect(casesPages.createDialogComponent()).toBeDefined();
    }));

    it('details should be shown details', fakeAsync(() => {
      casesPages.clickCaseDetail(casesPages.caseList[0]);
      fixture.detectChanges();
      tick();
      expect(casesPages.editDialog).toBeTrue();
      expect(casesPages.case).toBeDefined();
      expect(casesPages.editDialogComponent()).toBeDefined();
    }));

    it('should filter cases correctly by status', fakeAsync(() => {
      //FILTRO PENDING
      const pending = { status: [CaseStatus.PENDING], response: [], period: undefined };
      casesPages.caseFilter = pending;

      casesPages.filterChange({ value: undefined });
      tick();

      expect(casesPages.caseList.every((c) => c.caseStatus === CaseStatus.PENDING)).toBeTrue();

      //FILTRO SOLVED
      const solved = { status: [CaseStatus.SOLVED], response: [], period: undefined };
      casesPages.caseFilter = solved;

      casesPages.filterChange({ value: undefined });
      tick();

      expect(casesPages.caseList.every((c) => c.caseStatus === CaseStatus.SOLVED)).toBeTrue();

      //FILTRO ARCHIVED
      const archived = { status: [CaseStatus.ARCHIVED], response: [], period: undefined };
      casesPages.caseFilter = archived;

      casesPages.filterChange({ value: undefined });
      tick();

      expect(casesPages.caseList.every((c) => c.caseStatus === CaseStatus.ARCHIVED)).toBeTrue();

      //FILTRO OPEN

      const open = { status: [CaseStatus.OPEN], response: [], period: undefined };
      casesPages.caseFilter = open;

      casesPages.filterChange({ value: undefined });
      tick();

      expect(casesPages.caseList.every((c) => c.caseStatus === CaseStatus.OPEN)).toBeTrue();

      //FILTRO CLARIFICATION

      const clarification = {
        status: [CaseStatus.CLARIFICATION_PENDING],
        response: [],
        period: undefined,
      };
      casesPages.caseFilter = clarification;

      casesPages.filterChange({ value: undefined });
      tick();

      expect(
        casesPages.caseList.every((c) => c.caseStatus === CaseStatus.CLARIFICATION_PENDING)
      ).toBeTrue();
    }));
  });
});
