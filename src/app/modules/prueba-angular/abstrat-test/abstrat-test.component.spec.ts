import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstratTestComponent } from './abstrat-test.component';

describe('AbstratTestComponent', () => {
  let component: AbstratTestComponent;
  let fixture: ComponentFixture<AbstratTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbstratTestComponent]
    });
    fixture = TestBed.createComponent(AbstratTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
