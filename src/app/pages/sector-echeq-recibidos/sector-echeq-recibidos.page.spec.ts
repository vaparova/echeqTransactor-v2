import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SectorEcheqRecibidosPage } from './sector-echeq-recibidos.page';

describe('SectorEcheqRecibidosPage', () => {
  let component: SectorEcheqRecibidosPage;
  let fixture: ComponentFixture<SectorEcheqRecibidosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorEcheqRecibidosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SectorEcheqRecibidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
