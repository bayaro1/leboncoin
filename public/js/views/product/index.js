
import { InfoManager } from "../../components/InfoManager.js";
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

        
/*****delivery-info ***/
document.querySelectorAll('.js-info-opener').forEach(function(infoOpener) {
    new InfoManager(infoOpener);
});

/****filters*** */
document.querySelector('.filters-opener').addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.filters').classList.toggle('active');
    e.currentTarget.classList.toggle('active');
});

/*selects*/

document.querySelectorAll('.js-select').forEach(function(select) {
    new SelectManager(select, select.dataset.optionstemplate);
})


/*focus lightning sur le main-form dans main-searchpage*/    //A REFACTORISER

const onBodyClick = e => {
    if(!clickIsOnElement(e, document.querySelector('.focus-lightning'))) {
        focusLightningOff(document.querySelector('.main-searchpage .main-form'));
        document.querySelector('.main-searchpage .main-form .form-row:first-child').addEventListener('click', onFormFocus);
        document.body.removeEventListener('click', onBodyClick);
    }
}

const onFormFocus = (e) => {
    if(window.innerWidth < 1050) {
        return;
    }
    if(e.target === document.querySelector('.main-searchpage .main-form .btn.btn-blue')) {
        return;
    }
    focusLightningOn(document.querySelector('.main-searchpage .main-form'));
    e.currentTarget.removeEventListener('click', onFormFocus);
    e.target.focus();
    document.body.addEventListener('click', onBodyClick)
}

document.querySelector('.main-searchpage .main-form .form-row:first-child').addEventListener('click', onFormFocus);


/*favorite*/
const onFavoriteClick = e => {
    e.preventDefault();
    e.currentTarget.parentElement.parentElement.classList.toggle('in-cart');
}
document.querySelectorAll('.product-card-favorite')
        .forEach(favorite => {
            favorite.addEventListener('click', onFavoriteClick);
        });



/*save-search & scroll*/
const max_scroll = document.body.getBoundingClientRect().height - document.querySelector('.footer-block').getBoundingClientRect().height - window.innerHeight;
const min_scroll = max_scroll - document.querySelector('.results-list').getBoundingClientRect().height;
document.addEventListener('scroll', function(e) {
    if(window.scrollY > min_scroll + window.innerHeight && window.scrollY < max_scroll - window.innerHeight) {
        document.querySelector('.save-search-sticky').classList.add('small');
    } else {
        document.querySelector('.save-search-sticky').classList.remove('small');
    }
});
