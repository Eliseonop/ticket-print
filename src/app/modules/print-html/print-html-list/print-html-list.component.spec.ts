import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHtmlListComponent } from './print-html-list.component';

describe('PrintHtmlListComponent', () => {
  let component: PrintHtmlListComponent;
  let fixture: ComponentFixture<PrintHtmlListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintHtmlListComponent]
    });
    fixture = TestBed.createComponent(PrintHtmlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
