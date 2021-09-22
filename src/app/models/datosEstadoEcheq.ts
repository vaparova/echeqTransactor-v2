export class DatosEstadoEcheq{
    estados = [
       'En edición',
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
       'Devolución Pendiente'
    ];

    constructor(){}

    getEstado(idx: number): string{
        return this.estados[idx];
    }
}
