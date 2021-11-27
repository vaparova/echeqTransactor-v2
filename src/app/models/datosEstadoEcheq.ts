export class DatosEstadoEcheq{
    estados = [
       'En edicion',
       'Emitido - Pendiente',
       'Activo',
       'Custodia',
       'Activo - Pendiente',
       'Presentado',
       'Depositado',
       'Pagado',
       'Rechazado',
       'Repudiado',
       'Anulado',
       'Vencido',
       'Devolucion Pendiente'
    ];

    constructor(){}

    getEstado(idx: number): string{
        return this.estados[idx];
    }
}
