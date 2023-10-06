import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDetailsComponent } from './payroll-details.component';

describe('PayrollDetailsComponent', () => {
  let component: PayrollDetailsComponent;
  let fixture: ComponentFixture<PayrollDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollDetailsComponent]
    });
    fixture = TestBed.createComponent(PayrollDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
