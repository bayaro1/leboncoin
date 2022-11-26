
import { getPosition } from "./spatial.js";

/**
 * 
 * @param {HTMLElement} elt 
 */
 export function focusLightningOn(elt) {
    const position = getPosition(elt);

    const body_dark = document.createElement('div');
    body_dark.classList.add('body-dark');
    document.body.prepend(body_dark);
    
    const backElt = elt.cloneNode(true);
    backElt.classList.add('back-elt')
    elt.parentElement.append(backElt);
    elt.classList.add('focus-lightning');
    document.body.prepend(elt);
    elt.style.position = 'absolute';
    elt.style.top = position.top + 'px';
    elt.style.left = position.left + 'px';
    elt.style.right = position.right + 'px';
    elt.style.bottom = position.bottom + 'px';
}



export function focusLightningOff(elt) {
    const focus_elt = document.querySelector('.focus-lightning');
    focus_elt.classList.remove('focus-lightning');
    focus_elt.removeAttribute('style');
    elt.parentElement.replaceChild(focus_elt, elt);
    document.querySelector('.body-dark').remove();
}