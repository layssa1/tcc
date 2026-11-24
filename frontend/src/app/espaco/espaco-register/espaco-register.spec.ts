import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspacoRegister } from './espaco-register';

describe('EspacoRegister', () => {
  let component: EspacoRegister;
  let fixture: ComponentFixture<EspacoRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacoRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(EspacoRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
