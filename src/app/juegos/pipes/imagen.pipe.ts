import { Pipe, PipeTransform } from '@angular/core';
import { ExtensionArchivo, RutasArchivo } from '../interfaces/conf.interfaces';
import { JuegoShort } from '../interfaces/juegos.interfaces';

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  transform(idJuego: Number): string {
    return `${RutasArchivo.rutaimagen}${idJuego}${ExtensionArchivo.formatoPng}`;
    /* return 'assets/heroes/' + heroe.id + '.jpg'; */
  }
}
