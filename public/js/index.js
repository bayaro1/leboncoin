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


