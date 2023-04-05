import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconoidplataformacard',
})
export class IconoidplataformacardPipe implements PipeTransform {
  transform(plataforma: number): string {
    let cadena: string = '';
    switch (plataforma) {
      case 1:
        cadena = 'icon-stm.svg';
        break;
      case 2:
        cadena = 'xbsx.png';
        break;
      case 3:
        cadena = 'icon-seriesx-s.svg';
        break;
      case 4:
        cadena = 'ps5.png';
        break;
      case 5:
        cadena = 'icon-ps4.svg';
        break;
      case 6:
        cadena = 'icon-swt.svg';
        break;
    }
    return `assets/${cadena}`;
  }
}
