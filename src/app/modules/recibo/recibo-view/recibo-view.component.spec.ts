import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciboViewComponent } from './recibo-view.component';

describe('ReciboViewComponent', () => {
  let component: ReciboViewComponent;
  let fixture: ComponentFixture<ReciboViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReciboViewComponent]
    });
    fixture = TestBed.createComponent(ReciboViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
