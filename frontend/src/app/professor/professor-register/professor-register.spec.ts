import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorRegister } from './professor-register';

describe('ProfessorRegister', () => {
  let component: ProfessorRegister;
  let fixture: ComponentFixture<ProfessorRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
