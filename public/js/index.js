import { SliderManager } from "./components/SliderManager.js";

/** gestion de la navigation cachée en mode mobile et tablette */
const hiddenNavManager = new SliderManager('.hidden-nav');
hiddenNavManager.manage(
    '.hidden-nav-opener',
    '.hidden-nav-closer',
    1050,
    true
);


/*main form sliders*/
const mainFormSliderManager = new SliderManager('.main-form-slider');
/*category*/
mainFormSliderManager.manage(
    '.category-slider-opener',
    '.i-return'
);
/*q*/
mainFormSliderManager.manage(
    '.q-slider-opener',
    '.i-return'
);
/*location*/
mainFormSliderManager.manage(
    '.location-slider-opener',
    '.i-return'
);






// /* a refactoriser dans SliderManager (problème comme ça il ferme le slider dès l'ouverture) */
// document.body.addEventListener('click', onBodyClick);

// /**
//  * 
//  * @param {MouseEvent} e 
//  */
// function onBodyClick(e) {
//     const slider = document.querySelector('.main-form-slider');
//     if(slider.classList.contains('visible')) {
//         if(
//             e.clientX < slider.getBoundingClientRect().x 
//             ||
//             e.clientX > slider.getBoundingClientRect().x + slider.getBoundingClientRect().width
//             ||
//             e.clientY < slider.getBoundingClientRect().y 
//             ||
//             e.clientY > slider.getBoundingClientRect().y + slider.getBoundingClientRect().height
//         ) {
//             document.querySelector('.main-form-slider').classList.remove('visible');
//             document.body.classList.remove('frozen');
//         }
//     }
// }

