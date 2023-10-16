/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalidaPreview-32Component } from './salida-preview-32.component';

describe('SalidaPreview-32Component', () => {
  let component: SalidaPreview-32Component;
  let fixture: ComponentFixture<SalidaPreview-32Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalidaPreview-32Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaPreview-32Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
