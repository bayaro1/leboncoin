
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



class ClickListener {

    elt;
    onclick;

    constructor(elt) {
        this.elt = elt;
    }
    start() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }
    stop() {
        this.elt.removeEventListener('click', this.onclick);
    }

}


const clickListener = new ClickListener(document.querySelector('.icon.i-logo'));
clickListener.start()
            .then(function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(e.currentTarget);
            })
            .catch(function(error) {
                console.log('on capture cette erreur', error);
            })
            .finally(function() {
                clickListener.stop();
            })
 