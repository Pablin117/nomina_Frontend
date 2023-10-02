import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOnlineComponent } from './check-online.component';

describe('CheckOnlineComponent', () => {
  let component: CheckOnlineComponent;
  let fixture: ComponentFixture<CheckOnlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckOnlineComponent]
    });
    fixture = TestBed.createComponent(CheckOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
