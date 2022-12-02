/**
 * 
 * @param {HTMLElement} elt 
 * @param {string} parentClass 
 * @returns {boolean}
 */
export function hasSuchAncestor(elt, parentClass) {
    if(!elt.parentElement) {
        return false;
    }
    if(elt.parentElement.classList.contains(parentClass)) {
        return true;
    }
    return hasSuchAncestor(elt.parentElement, parentClass);
}