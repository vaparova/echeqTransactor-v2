import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EcheqEndosadosComponent } from './echeq-endosados.component';

describe('EcheqEndosadosComponent', () => {
  let component: EcheqEndosadosComponent;
  let fixture: ComponentFixture<EcheqEndosadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcheqEndosadosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EcheqEndosadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
