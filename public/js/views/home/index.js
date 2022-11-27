
import { CarouselArrowManager } from "../../components/CarouselArrowManager.js";



/**carousels */

new CarouselArrowManager(
    document.querySelector('.top-category .carousel.car-arrow'),
    700
);

document.querySelectorAll('.last-suggest .carousel.car-arrow')
        .forEach(function(carousel) {
            new CarouselArrowManager(carousel, 1200, 5);
        });

