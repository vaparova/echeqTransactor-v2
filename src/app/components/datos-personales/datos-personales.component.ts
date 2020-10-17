import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent implements OnInit {
  usuario: DatosUsuario;
  forma: FormGroup;
  readonly = true;


  constructor(private user: UsuariosService, private fb: FormBuilder) {
    this.usuario = this.user.obtenerUsuario(20277852536);
    console.log(this.usuario);
    this.crearFormulario();
    this.cargarData();
  }
  ngOnInit() {}

  crearFormulario(): void{
    this.forma = this.fb.group({
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cuil: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(15)]],
      calle: ['', [Validators.required, Validators.minLength(3)]],
      altura: ['', [Validators.required, Validators.minLength(1)]],
      cp: ['', [Validators.required, Validators.minLength(4)]],
      localidad: ['', [Validators.required, Validators.minLength(3)]],
      provincia: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  cargarData(): void {
    this.forma.reset({
      apellido: this.usuario.usuario.datosPersonales.apellido,
      nombre: this.usuario.usuario.datosPersonales.nombre,
      cuil: this.usuario.usuario.datosPersonales.cuil,
      email: this.usuario.usuario.datosPersonales.email,
      telefono: this.usuario.usuario.datosPersonales.tel,
      calle: this.usuario.usuario.datosPostales.calle,
      altura: this.usuario.usuario.datosPostales.altura,
      cp: this.usuario.usuario.datosPostales.cp,
      localidad: this.usuario.usuario.datosPostales.localidad,
      provincia: this.usuario.usuario.datosPostales.provincia,
    });
  }

  editar(){
    this.readonly = false;
  }

  guardar(){
    this.readonly = true;
  }

}

// // esto se podría mandar a un pipe
// for (const prop in this.usuario.usuario.datosPersonales) {
//   if (this.usuario.usuario.datosPersonales.hasOwnProperty(prop)) {
//     this.otro.push(
//       {
//         clave: prop,
//         valor: this.usuario.usuario.datosPersonales[prop],
//         tipo: typeof this.usuario.usuario.datosPersonales[prop]
//       }
//     );
//   }
// }
