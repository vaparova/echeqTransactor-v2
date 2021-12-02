export class DatosEstadoEcheq{
    estados = [
       'En edicion',            // 0
       'Emitido - Pendiente',   // 1
       'Activo',                // 2
       'Custodia',              // 3
       'Activo - Pendiente',    // 4
       'Presentado',            // 5
       'Depositado',            // 6
       'Pagado',                // 7
       'Rechazado',             // 8
       'Repudiado',             // 9
       'Anulado',               // 10
       'Vencido',               // 11
       'Devolucion Pendiente',  // 12
       'Acuerdo Pendiente',     // 13
       'Rechazado Acordado'     // 14
    ];

    constructor(){}

    getEstado(idx: number): string{
        return this.estados[idx];
    }
}
