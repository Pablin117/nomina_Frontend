import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUserComponent } from './status-user.component';

describe('StatusUserComponent', () => {
  let component: StatusUserComponent;
  let fixture: ComponentFixture<StatusUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusUserComponent]
    });
    fixture = TestBed.createComponent(StatusUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
