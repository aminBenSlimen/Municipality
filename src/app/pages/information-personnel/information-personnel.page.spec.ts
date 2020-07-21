import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationPersonnelPage } from './information-personnel.page';

describe('InformationPersonnelPage', () => {
  let component: InformationPersonnelPage;
  let fixture: ComponentFixture<InformationPersonnelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationPersonnelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationPersonnelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
