/**
 * renvoie true si le click a été fait sur l'élément, sinon false
 * @param {MouseEvent} e 
 * @param {HTMLElement} elt 
 * @returns {boolean}
 */
export function clickIsOnElement(e, elt) {
    const rect = elt.getBoundingClientRect();
    return (
        e.clientX >= rect.x
        &&
        e.clientX <= rect.x + rect.width
        &&
        e.clientY >= rect.y 
        &&
        e.clientY <= rect.y + rect.height
    );
}


/**
 * 
 * @param {HTMLElement} elt 
 * @returns {{top: number, bottom: number, right: number, left: number}}
 */
export function getPosition(elt) {
    return {
        top: getTopPosition(elt),
        bottom: getBottomPosition(elt),
        left: getLeftPosition(elt),
        right: getRightPosition(elt),
    }
}



function getTopPosition(elt) {
    if(elt.parentElement) {
        elt.offsetTop + getTopPosition(elt.parentElement);
    }
    return elt.offsetTop;
}
function getBottomPosition(elt) {
    if(elt.parentElement) {
        elt.offsetBottom + getBottomPosition(elt.parentElement);
    }
    return elt.offsetBottom;
}
function getLeftPosition(elt) {
    if(elt.parentElement) {
        elt.offsetLeft + getLeftPosition(elt.parentElement);
    }
    return elt.offsetLeft;
}
function getRightPosition(elt) {
    if(elt.parentElement) {
        elt.offsetRight + getRightPosition(elt.parentElement);
    }
    return elt.offsetRight;
}