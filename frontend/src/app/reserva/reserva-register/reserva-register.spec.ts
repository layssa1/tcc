import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservaRegister } from './reserva-register';

describe('ReservaRegister', () => {
  let component: ReservaRegister;
  let fixture: ComponentFixture<ReservaRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservaRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
