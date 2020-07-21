import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TypeDeReclamationPage } from './type-de-reclamation.page';

describe('TypeDeReclamationPage', () => {
  let component: TypeDeReclamationPage;
  let fixture: ComponentFixture<TypeDeReclamationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeDeReclamationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypeDeReclamationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
