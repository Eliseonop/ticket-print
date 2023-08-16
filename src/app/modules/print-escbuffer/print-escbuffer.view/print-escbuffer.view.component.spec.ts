import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEscbufferViewComponent } from './print-escbuffer.view.component';

describe('PrintEscbufferViewComponent', () => {
  let component: PrintEscbufferViewComponent;
  let fixture: ComponentFixture<PrintEscbufferViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintEscbufferViewComponent]
    });
    fixture = TestBed.createComponent(PrintEscbufferViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
