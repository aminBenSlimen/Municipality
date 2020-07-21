import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationDeReclamationPage } from './information-de-reclamation.page';

describe('InformationDeReclamationPage', () => {
  let component: InformationDeReclamationPage;
  let fixture: ComponentFixture<InformationDeReclamationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationDeReclamationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationDeReclamationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
