import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleMaintenanceComponent } from './module-maintenance.component';

describe('ModuleMaintenanceComponent', () => {
  let component: ModuleMaintenanceComponent;
  let fixture: ComponentFixture<ModuleMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleMaintenanceComponent]
    });
    fixture = TestBed.createComponent(ModuleMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
