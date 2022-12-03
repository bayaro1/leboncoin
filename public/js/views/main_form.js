
import { InfoManager } from "../components/InfoManager.js";
import { SliderManager } from "../components/SliderManager.js";
import { AutoCountResults } from "../components/Form/AutoCountResults.js";
import { AutoSuggestor } from "../components/Form/AutoSuggestor.js";
import { LocationManager } from "../components/Form/LocationManager.js";

/******main form input sliders*******/
const inputSliderManager = new SliderManager('.main-form-slider[data-contain=input-slider]');
document.querySelectorAll('.q-slider-opener, .location-slider-opener')
            .forEach(function(sliderElt) {
                sliderElt.addEventListener('click', function(e) {
                    
                    if(window.innerWidth < 1050) {
                        inputSliderManager.onOpenerClick(e.currentTarget);
                        
                        /*auto-suggest*/
                        document.querySelectorAll('.main-form-slider .js-auto-suggest')
                                .forEach(function(elt) {
                                    new AutoSuggestor(elt);
                                });
                        
                        /*auto-count-results*/
                        new AutoCountResults(
                            document.querySelector('.main-form-slider .js-form'),
                            [
                                'change',
                                AutoSuggestor.autoSuggestValidated,
                                LocationManager.locationValidation,
                                LocationManager.locationRemove
                            ]
                            );

                        /*location manager*/
                        if(e.currentTarget.classList.contains('location-slider-opener')) {
                            new LocationManager(document.querySelector('.main-form-slider .main-form-input.main-form-location'));
                        }

                        /*on met le focus sur l'input concerné*/
                        if(document.querySelector('.main-form-slider .location-bubbles-container')) {
                            if(!document.querySelector('.main-form-slider .location-bubbles-container').classList.contains('visible')) {
                                document.querySelector('.main-form-slider .main-form-input').focus();
                            }
                        } else {
                            document.querySelector('.main-form-slider .main-form-input').focus();
                        }
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
                    document.querySelector('.main-form').dispatchEvent(new Event('change'));
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


/*auto-count-results*/
new AutoCountResults(
    document.querySelector('.js-form'),
    [
        'change',
        AutoSuggestor.autoSuggestValidated,
        LocationManager.locationValidation,
        LocationManager.locationRemove
    ]
    );



/*auto-suggest*/

document.querySelectorAll('.js-auto-suggest')
        .forEach(function(elt) {
            new AutoSuggestor(elt);
        });




/*Location manager*/
const locationManager = new LocationManager(
    document.querySelector('.main-form-input.main-form-location'),
    document.querySelector('.main-form-slider .main-form-input.main-form-location')
    );





