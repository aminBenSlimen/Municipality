import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleClaimPagePage } from './single-claim-page.page';

describe('SingleClaimPagePage', () => {
  let component: SingleClaimPagePage;
  let fixture: ComponentFixture<SingleClaimPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleClaimPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleClaimPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
