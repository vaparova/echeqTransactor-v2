export class Evento{
    text: string;
    color: string;
    start: Date;
    end: Date;
    allDay: boolean;

    constructor(text: string, description: string){
        const ahora         = new Date();
        const despues       = ahora.getHours() + 1;

        this.text           = text;
        this.color          = '#A6D3CF';

        this.start          = new Date (
                                ahora.getFullYear(),
                                ahora.getMonth(),
                                ahora.getDate(),
                                ahora.getHours(),
                                ahora.getMinutes()
                            );

        this.end            = new Date(
                                ahora.getFullYear(),
                                ahora.getMonth(),
                                ahora.getDate(),
                                despues,
                                ahora.getMinutes(),
                            );

        this.allDay           = false;
    }
}
