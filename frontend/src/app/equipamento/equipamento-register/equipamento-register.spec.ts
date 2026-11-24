import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipamentoRegister } from './equipamento-register';

describe('EquipamentoRegister', () => {
  let component: EquipamentoRegister;
  let fixture: ComponentFixture<EquipamentoRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipamentoRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipamentoRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
