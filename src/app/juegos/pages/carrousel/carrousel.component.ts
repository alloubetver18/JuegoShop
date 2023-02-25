import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.css'],
})
export class CarrouselComponent implements OnInit {
  cardsWidth = 0;
  carouselWidth = 0;
  scrollPosition = 0;
  carousel = document.getElementsByClassName('carousel-inner')[0];

  ngOnInit(): void {
    this.cardsWidth =
      document.getElementsByClassName('carousel-item')[0].clientWidth;
    this.carouselWidth =
      document.getElementsByClassName('carousel-inner')[0].clientWidth;
    const myCarouselElement = document.querySelector('#carouselExample');

    const carousel = new bootstrap.Carousel(myCarouselElement!, {
      interval: 2000,
      touch: false,
    });
  }

  anterior() {
    console.log(this.cardsWidth, this.carouselWidth);
    if (this.scrollPosition < this.carouselWidth - this.cardsWidth * 4) {
      this.scrollPosition += this.cardsWidth;
      this.carousel.animate({ scrollLeft: this.scrollPosition }, 600);
    }
  }
}
