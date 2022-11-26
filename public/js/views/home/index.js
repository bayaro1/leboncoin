import { CarouselArrowManager } from "../../components/CarouselArrowManager.js";
import { InfoManager } from "../../components/InfoManager.js";
import { SliderManager } from "../../components/SliderManager.js";



/******main form input sliders*******/
const inputSliderManager = new SliderManager('.main-form-slider[data-contain=input-slider]');
document.querySelectorAll('.q-slider-opener, .location-slider-opener')
            .forEach(function(sliderElt) {
                sliderElt.addEventListener('click', function(e) {
                    
                    if(window.innerWidth < 1050) {
                        inputSliderManager.onOpenerClick(e.currentTarget);
                        document.querySelector('.main-form-slider .main-form-input').focus();
                    }
                })
            });

/*******main form category slider ******/
const categorySliderManager = new SliderManager('.main-form-slider[data-contain=category-slider]');
document.querySelector('.category-slider-opener')
        .addEventListener('click', function(e) {
            e.preventDefault();  // obligé car le opener est un button
            categorySliderManager.onOpenerClick(e.currentTarget);
            /*a refactoriser*/
            document.querySelectorAll('.main-form-category-item').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    const option = document.querySelector('.main-form-category option');
                    option.setAttribute('value', item.dataset.value);
                    document.querySelector('.category-slider-opener label').innerText = item.dataset.label;

                    if(item.dataset.iconleft === undefined) {
                        document.querySelector('.category-slider-opener').classList.add('no-icon-left');
                    } else {
                        document.querySelector('.category-slider-opener').classList.remove('no-icon-left');
                    }

                    categorySliderManager.close();
                });
            });
        });

/****filters*** */
document.querySelector('.filters-opener').addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.filters').classList.toggle('active');
    e.currentTarget.classList.toggle('active');
});

/*****delivery-info ***/
document.querySelectorAll('.js-info-opener').forEach(function(infoOpener) {
    new InfoManager(infoOpener);
})


/**carousels */

new CarouselArrowManager(
    document.querySelector('.top-category .carousel.car-arrow'),
    700
);

document.querySelectorAll('.last-suggest .carousel.car-arrow')
        .forEach(function(carousel) {
            new CarouselArrowManager(carousel, 1200, 5);
        });


/**on form-submission */
document.querySelector('.main-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const sort_inputs = document.querySelector('.search-sort-select .sort-hidden-inputs');
    if(sort_inputs) {
        e.currentTarget.append(sort_inputs);
    }
    
    if(e.currentTarget.querySelector('select[name=category] option').value === '') {
        e.currentTarget.querySelector('select[name=category]').removeAttribute('name');
    } 
    for(const field of ['q', 'location', 'offersOrNeeds', 'max_price', 'min_price']) {
        const input = e.currentTarget.querySelector('input[name='+field+']');
        if(input.value === '') {
            input.removeAttribute('name');
        }
    }

    e.currentTarget.submit();
});
