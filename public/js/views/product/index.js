
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



const form_row = document.querySelector('.main-searchpage .main-form .form-row:first-child');

document.querySelector('.body-dark').setAttribute(
    'style',
    'position: absolute; z-index: 3; top: 0; bottom: 0; left: 0; right: 0; background-color: rgba(0, 0, 0, 0.5)'
)
const lighting_form = document.querySelector('.main-searchpage .main-form');
document.querySelector('.main-searchpage').append(lighting_form.cloneNode(true));
lighting_form.classList.add('lightning-form', 'main-form');

document.body.prepend(lighting_form);

}
