import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodComponent } from './payroll-period.component';

describe('PayrollPeriodComponent', () => {
  let component: PayrollPeriodComponent;
  let fixture: ComponentFixture<PayrollPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollPeriodComponent]
    });
    fixture = TestBed.createComponent(PayrollPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
