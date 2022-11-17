export class CarouselArrowManager {

    /** @type {number} */
    scroll = 0;

    /** @type {number} */
    speed;

    /** @type {number} */
    gap;

    /** @type {number} */
    max_scroll;


    /**
     * 
     * @param {string} carouselSelector 
     * @param {number} speed unit: px/s
     * @param {number} gap number of items to scroll on each arrow click
     */
    constructor(carouselSelector, speed, gap = 1) {
        this.speed = speed / 100;

        const margin = this.#calculateMargin(carouselSelector);
        const item_width = document
                                .querySelector(carouselSelector + ' .carousel-item')
                                .getBoundingClientRect().width 
                                + margin;
        
        this.gap = item_width * gap;
                                
        const total_width = document
                                .querySelectorAll(carouselSelector + ' .carousel-item')
                                .length 
                                * item_width
                                - margin;
        this.max_scroll = total_width - document.querySelector(carouselSelector).getBoundingClientRect().width;
        

        document.querySelector(carouselSelector + ' .i-car-arrow.i-car-right')
                .addEventListener('click', e => this.#right())
                ;
        document.querySelector(carouselSelector + ' .i-car-arrow.i-car-left')
                .addEventListener('click', e => this.#left())
                ; 
        
    }

    #right() {
        const car = this;
        const end = car.scroll + car.gap;
        const timer = setInterval(function() {
            car.scroll += car.speed;
            if(car.scroll >= car.max_scroll || car.scroll >= end) {
                clearInterval(timer);
                car.scroll = car.scroll >= car.max_scroll ? car.max_scroll: end;
            }
            document.querySelector('.carousel.car-arrow').scroll(car.scroll, 0);
        }, 10)
    }
    #left() {
        const car = this;
        const end = car.scroll - car.gap;
        const timer = setInterval(function() {
            car.scroll -= car.speed;
            if(car.scroll <= 0 || car.scroll <= end) {
                clearInterval(timer);
                car.scroll = car.scroll <= 0 ? 0: end;
            }
            document.querySelector('.carousel.car-arrow').scroll(car.scroll, 0);
        }, 10)
    }

    /**
     * 
     * @param {string} carouselSelector 
     * @returns {number}
     */
    #calculateMargin(carouselSelector) {
        const item1 = document.querySelector(carouselSelector + ' .carousel-item:first-of-type'); 
        const item2 = document.querySelector(carouselSelector + ' .carousel-item:nth-of-type(2)'); 
        const start = item1.getBoundingClientRect().x  + item1.getBoundingClientRect().width;
        const end = item2.getBoundingClientRect().x;
        return end - start;
    }
}

