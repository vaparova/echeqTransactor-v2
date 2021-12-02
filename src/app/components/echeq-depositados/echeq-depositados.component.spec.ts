import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EcheqDepositadosComponent } from './echeq-depositados.component';

describe('EcheqDepositadosComponent', () => {
  let component: EcheqDepositadosComponent;
  let fixture: ComponentFixture<EcheqDepositadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcheqDepositadosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EcheqDepositadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
