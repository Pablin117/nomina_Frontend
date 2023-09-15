import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRulesComponent } from './company.component';

describe('CompanyRulesComponent', () => {
  let component: CompanyRulesComponent;
  let fixture: ComponentFixture<CompanyRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyRulesComponent]
    });
    fixture = TestBed.createComponent(CompanyRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
