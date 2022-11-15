import { SliderManager } from "./components/SliderManager.js";


/** gestion de la navigation cachée en mode mobile et tablette */
const hiddenNavManager = new SliderManager('.hidden-nav');
document.querySelector('.hidden-nav-opener').addEventListener('click', e => hiddenNavManager.onOpenerClick(e.currentTarget));


/*main form sliders*/
const mainFormSliderManager = new SliderManager('.main-form-slider');

/*q*/
document.querySelector('.q-slider-opener')
        .addEventListener(
            'click', 
            e => mainFormSliderManager.onOpenerClick(e.currentTarget)
        );
/*location*/
document.querySelector('.location-slider-opener')
        .addEventListener(
            'click', 
            e => mainFormSliderManager.onOpenerClick(e.currentTarget)
        );


//*category*/
document.querySelector('.category-slider-opener')
        .addEventListener('click', function(e) {
            e.preventDefault();  // obligé car le opener est un button
            mainFormSliderManager.onOpenerClick(e.currentTarget);

            /*a refactoriser*/
            document.querySelectorAll('.main-form-category-item').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    const option = document.querySelector('.main-form-category option');
                    option.setAttribute('value', item.dataset.value);
                    document.querySelector('.category-slider-opener label').innerText = item.dataset.label;

                    console.log(item.dataset.iconleft);
                    if(item.dataset.iconleft === undefined) {
                        document.querySelector('.category-slider-opener').classList.add('no-icon-left');
                    } else {
                        document.querySelector('.category-slider-opener').classList.remove('no-icon-left');
                    }

                    mainFormSliderManager.close();
                });
            });
        })