import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHtmlPreviewComponent } from './print-html-preview.component';

describe('PrintHtmlPreviewComponent', () => {
  let component: PrintHtmlPreviewComponent;
  let fixture: ComponentFixture<PrintHtmlPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintHtmlPreviewComponent]
    });
    fixture = TestBed.createComponent(PrintHtmlPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
