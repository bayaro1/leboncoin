
import { SelectManager } from "../components/Form/SelectManager.js";

import { SliderManager } from "../components/SliderManager.js";
/** gestion de la navigation cachée en mode mobile et tablette */
const hiddenNavManager = new SliderManager('.hidden-nav');
document.querySelector('.hidden-nav-opener')
        .addEventListener('click', function(e) {
            if(window.innerWidth < 1050) {
                hiddenNavManager.onOpenerClick(e.currentTarget)
            }
        });

/*selects*/

document.querySelectorAll('.js-select').forEach(function(select) {
    new SelectManager(select, select.dataset.optionstemplate);
})







/**********************************DEV************************************* */
/**************************************************************************** */
/*dev-todo*/
document.querySelector('.dev-todo-closer').addEventListener('click', function(e) {
    document.querySelector('.dev-todo').remove();
})