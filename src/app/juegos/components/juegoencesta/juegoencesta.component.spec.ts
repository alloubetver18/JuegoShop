import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoencestaComponent } from './juegoencesta.component';

describe('JuegoencestaComponent', () => {
  let component: JuegoencestaComponent;
  let fixture: ComponentFixture<JuegoencestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JuegoencestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegoencestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
