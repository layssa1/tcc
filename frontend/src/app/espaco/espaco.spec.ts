import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Espaco } from './espaco';

describe('Espaco', () => {
  let component: Espaco;
  let fixture: ComponentFixture<Espaco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Espaco],
    }).compileComponents();

    fixture = TestBed.createComponent(Espaco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
