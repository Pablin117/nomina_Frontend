import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritiProfileComponent } from './securiti-profile.component';

describe('SecuritiProfileComponent', () => {
  let component: SecuritiProfileComponent;
  let fixture: ComponentFixture<SecuritiProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecuritiProfileComponent]
    });
    fixture = TestBed.createComponent(SecuritiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
