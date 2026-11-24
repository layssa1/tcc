import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorCalandario } from './professor-calandario';

describe('ProfessorCalandario', () => {
  let component: ProfessorCalandario;
  let fixture: ComponentFixture<ProfessorCalandario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorCalandario],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorCalandario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
