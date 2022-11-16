import { InfoManager } from "./components/InfoManager.js";
import { SliderManager } from "./components/SliderManager.js";


/** gestion de la navigation cachée en mode mobile et tablette */
const hiddenNavManager = new SliderManager('.hidden-nav');
document.querySelector('.hidden-nav-opener')
        .addEventListener(
            'click', 
            e => hiddenNavManager.onOpenerClick(e.currentTarget)
        );

/******main form input sliders*******/
const inputSliderManager = new SliderManager('.main-form-slider[data-contain=input-slider]');
document.querySelectorAll('.q-slider-opener, .location-slider-opener')
            .forEach(function(sliderElt) {
                sliderElt.addEventListener('click', function(e) {
                    inputSliderManager.onOpenerClick(e.currentTarget);
                    document.querySelector('.main-form-slider .main-form-input').focus();
                })
            })

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



/*****delivery-info ***/
new InfoManager('.js-delivery-info');