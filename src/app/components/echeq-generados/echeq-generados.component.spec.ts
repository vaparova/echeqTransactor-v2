import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EcheqGeneradosComponent } from './echeq-generados.component';

describe('EcheqGeneradosComponent', () => {
  let component: EcheqGeneradosComponent;
  let fixture: ComponentFixture<EcheqGeneradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcheqGeneradosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EcheqGeneradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
