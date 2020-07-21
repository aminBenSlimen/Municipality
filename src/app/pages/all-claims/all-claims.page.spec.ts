import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllClaimsPage } from './all-claims.page';

describe('AllClaimsPage', () => {
  let component: AllClaimsPage;
  let fixture: ComponentFixture<AllClaimsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllClaimsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllClaimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
