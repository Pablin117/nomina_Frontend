import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaComponent } from './planilla.component';

describe('PlanillaComponent', () => {
  let component: PlanillaComponent;
  let fixture: ComponentFixture<PlanillaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanillaComponent]
    });
    fixture = TestBed.createComponent(PlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
