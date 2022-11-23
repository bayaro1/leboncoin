
import { SelectManager } from "../../components/Form/SelectManager.js";
import { SliderManager } from "../../components/SliderManager.js";
import { clickIsOnElement } from "../../functions/spatial.js";
import { focusLightningOff, focusLightningOn } from "../../functions/style.js";

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

/*selects*/

document.querySelectorAll('.js-select').forEach(function(select) {
    new SelectManager(select, select.dataset.optionstemplate);
})


/*focus lightning sur le main-form dans main-searchpage*/    //A REFACTORISER

const onBodyClick = e => {
    if(!clickIsOnElement(e, document.querySelector('.focus-lightning'))) {
        focusLightningOff(document.querySelector('.main-searchpage .main-form'));
        document.querySelector('.main-searchpage .main-form').addEventListener('click', onFormFocus);
        document.body.removeEventListener('click', onBodyClick);
    }
}

const onFormFocus = (e) => {
    focusLightningOn(e.currentTarget);
    e.currentTarget.removeEventListener('click', onFormFocus);
    e.target.focus();
    document.body.addEventListener('click', onBodyClick)
}

document.querySelector('.main-searchpage .main-form').addEventListener('click', onFormFocus);




