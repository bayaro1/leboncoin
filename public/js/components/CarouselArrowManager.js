export class CarouselArrowManager {

    /**@type {HTMLElement} */
    carousel

    /**@type {number} */
    #margin = null;

    /** @type {number} */
    scroll = 0;

    /** @type {number} */
    speed;

    /** @type {number} */
    gap;

    /** @type {number} */
    max_scroll;

    scrolling = false;


    /**
     * 
     * @param {HTMLElement} carousel 
     * @param {number} speed unit: px/s
     * @param {number} gap number of items to scroll on each arrow click
     */
    constructor(carousel, speed, gap = 1) {
        this.carousel = carousel;
        this.speed = speed / 100;

        const item_width = this.carousel.querySelector('.carousel-item')
                                        .getBoundingClientRect().width 
                                        + this.#getMargin();
        this.gap = item_width * gap;  
        const total_width = this.carousel.querySelectorAll('.carousel-item')
                                .length 
                                * item_width
                                - this.#getMargin();
        this.max_scroll = total_width - this.carousel.getBoundingClientRect().width;
        this.#addArrows();
        this.#listenOnArrowClick();
    }
    #addArrows() {
        this.carousel.prepend(
            document.getElementById('car-arrows-template').content.cloneNode(true)
        );
    }
    #listenOnArrowClick() {
        this.carousel.querySelector('.i-car-arrow.i-car-right')
                .addEventListener('click', e => this.#right())
                ;
        this.carousel.querySelector('.i-car-arrow.i-car-left')
                .addEventListener('click', e => this.#left())
                ; 
    }


    #right() {
        const car = this;
        if(car.scrolling) {
            return;
        } else {
            car.scrolling = true;
        }
        const start = car.scroll;
        const end = (Math.floor(start / car.gap) * car.gap) + car.gap;
        const timer = setInterval(function() {
            car.scroll += car.speed;
            if(car.scroll >= car.max_scroll || car.scroll >= end) {
                if(car.scroll >= car.max_scroll) {
                    car.carousel.querySelector('.i-car-arrow.i-car-right').classList.add('disabled');
                    car.scroll = car.max_scroll;
                } else {
                    car.scroll = end;
                }
                if(start <= 0) {
                    car.carousel.querySelector('.i-car-arrow.i-car-left').classList.remove('disabled');
                }
                car.scrolling = false;
                clearInterval(timer);
            }
            car.carousel.scroll(car.scroll, 0);
        }, 10);

        
    }
    #left() {
        const car = this;
        if(car.scrolling) {
            return;
        } else {
            car.scrolling = true;
        }
        const start = car.scroll;
        const end = (Math.ceil(start / car.gap) * car.gap) - car.gap;
        const timer = setInterval(function() {
            car.scroll -= car.speed;
            if(car.scroll <= 0 || car.scroll <= end) {
                if(car.scroll <= 0) {
                    car.carousel.querySelector('.i-car-arrow.i-car-left').classList.add('disabled');
                    car.scroll = 0;
                } else {
                    car.scroll = end;
                }
                if(start >= car.max_scroll) {
                    car.carousel.querySelector('.i-car-arrow.i-car-right').classList.remove('disabled');
                }

                car.scrolling = false;
                clearInterval(timer);
            }
            car.carousel.scroll(car.scroll, 0);
        }, 10);
    }

    /**
     * 
     * @returns {number}
     */
    #getMargin() {
        if(this.#margin === null) {
            const item1 = this.carousel.querySelector('.carousel-item:first-of-type'); 
            const item2 = this.carousel.querySelector('.carousel-item:nth-of-type(2)'); 
            const start = item1.getBoundingClientRect().x  + item1.getBoundingClientRect().width;
            const end = item2.getBoundingClientRect().x;
            this.#margin = end - start;
        }
        return this.#margin;
    }
}

