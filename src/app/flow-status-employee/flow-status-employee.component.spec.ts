import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowStatusEmployeeComponent } from './flow-status-employee.component';

describe('FlowStatusEmployeeComponent', () => {
  let component: FlowStatusEmployeeComponent;
  let fixture: ComponentFixture<FlowStatusEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowStatusEmployeeComponent]
    });
    fixture = TestBed.createComponent(FlowStatusEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
