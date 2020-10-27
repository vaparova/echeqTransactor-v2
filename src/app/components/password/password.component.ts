import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  usuario: DatosUsuario;
  forma: FormGroup;

  constructor( private user: UsuariosService, private fb: FormBuilder ) {
    this.usuario = this.user.obtenerUsuario(27364183807);
    this.crearFormulario();
  }

  crearFormulario(): void{
    this.forma = this.fb.group({
        actual: ['', [Validators.required, Validators.minLength(8)]],
        nueva: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
        repetir: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
       });
  }

  ngOnInit() {}

}
