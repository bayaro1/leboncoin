/**
 * 
 * @param {HTMLElement} elt 
 * @param {string} eventName 
 */
export function listen(elt, eventName) {
    return new Promise((resolve, _) => {
        const onEvent = (e) => {
            resolve(e);
        }
        elt.addEventListener(eventName, onEvent);
    })
}