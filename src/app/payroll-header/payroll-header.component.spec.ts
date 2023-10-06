import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollHeaderComponent } from './payroll-header.component';

describe('PayrollHeaderComponent', () => {
  let component: PayrollHeaderComponent;
  let fixture: ComponentFixture<PayrollHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollHeaderComponent]
    });
    fixture = TestBed.createComponent(PayrollHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
