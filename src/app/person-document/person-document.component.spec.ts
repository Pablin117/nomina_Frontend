import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDocumentComponent } from './person-document.component';

describe('PersonDocumentComponent', () => {
  let component: PersonDocumentComponent;
  let fixture: ComponentFixture<PersonDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonDocumentComponent]
    });
    fixture = TestBed.createComponent(PersonDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
