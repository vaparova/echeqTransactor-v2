import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EcheqRecibidosComponent } from './echeq-recibidos.component';

describe('EcheqRecibidosComponent', () => {
  let component: EcheqRecibidosComponent;
  let fixture: ComponentFixture<EcheqRecibidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcheqRecibidosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EcheqRecibidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
