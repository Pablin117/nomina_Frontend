import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBankEmployeeComponent } from './account-bank-employee.component';

describe('AccountBankEmployeeComponent', () => {
  let component: AccountBankEmployeeComponent;
  let fixture: ComponentFixture<AccountBankEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountBankEmployeeComponent]
    });
    fixture = TestBed.createComponent(AccountBankEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
