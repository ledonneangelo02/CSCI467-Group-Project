import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocreateComponent } from './pocreate.component';

describe('PocreateComponent', () => {
  let component: PocreateComponent;
  let fixture: ComponentFixture<PocreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PocreateComponent]
    });
    fixture = TestBed.createComponent(PocreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
