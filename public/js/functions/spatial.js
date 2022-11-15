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