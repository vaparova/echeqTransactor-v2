import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  passIguales( pass1: string, pass2: string ): any{
    return ( formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];

      if ( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors( null );
        }else{
        pass2Control.setErrors( {noEsIgual: true} );
        }
    };
  }

  passActual(pass1: string, pass2: string): any {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1];

      if (pass1Control.value === pass2){
        pass1Control.setErrors( null);
      }else{
        pass1Control.setErrors( {noCoincidePassActual: true});
      }
    };
  }
}
