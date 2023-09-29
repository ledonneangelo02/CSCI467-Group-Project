import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteeditComponent } from './quoteedit.component';

describe('QuoteeditComponent', () => {
  let component: QuoteeditComponent;
  let fixture: ComponentFixture<QuoteeditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteeditComponent]
    });
    fixture = TestBed.createComponent(QuoteeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
