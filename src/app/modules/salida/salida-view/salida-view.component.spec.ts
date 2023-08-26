import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaViewComponent } from './salida-view.component';

describe('SalidaViewComponent', () => {
  let component: SalidaViewComponent;
  let fixture: ComponentFixture<SalidaViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalidaViewComponent]
    });
    fixture = TestBed.createComponent(SalidaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
