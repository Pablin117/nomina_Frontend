import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusEmployeeComponent } from './status-employee.component';

describe('StatusEmployeeComponent', () => {
  let component: StatusEmployeeComponent;
  let fixture: ComponentFixture<StatusEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusEmployeeComponent]
    });
    fixture = TestBed.createComponent(StatusEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
