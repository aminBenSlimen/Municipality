import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResultatFinalPage } from './resultat-final.page';

describe('ResultatFinalPage', () => {
  let component: ResultatFinalPage;
  let fixture: ComponentFixture<ResultatFinalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultatFinalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultatFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
