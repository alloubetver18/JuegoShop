import { Pipe, PipeTransform } from '@angular/core';
import { JuegoShort } from '../interfaces/juegos.interfaces';

@Pipe({
  name: 'icono',
})
export class IconoPipe implements PipeTransform {
  transform(plataforma: string): string {
    let cadena: string = '';
    switch (plataforma) {
      case 'PC':
        cadena = 'icon-stm.svg';
        break;
      case 'XBox One X':
        cadena = 'xbsx.png';
        break;
      case 'PS4':
        cadena = 'icon-ps4.svg';
        break;
      case 'Nintendo Switch':
        cadena = 'icon-swt.svg';
        break;
      case 'XBox Series X':
        cadena = 'icon-seriesx.png';
        break;
      case 'XBox Series S':
        cadena = 'icon-seriess.png';
        break;
      case 'PS5':
        cadena = 'ps5.png';
        break;
    }
    return `assets/${cadena}`;
    /* return 'assets/heroes/' + heroe.id + '.jpg'; */
  }
}
