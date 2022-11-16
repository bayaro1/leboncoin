import { clickIsOnElement } from "../functions/spatial.js";


export class CloseHandler {

    /** @type {HTMLElement} */
    #eltToClose;

    /** @type {callable} */
    #callOnBodyClick;

    /** @type {Object} */
    #eltManager;

    /**
     * @param {HTMLElement} eltToClose
     * @param {HTMLElement} closerElt 
     * @param {Object} eltManager  // doit contenir une méthode close accessible en public
     */
    constructor(eltToClose, closerElt, eltManager) {

        this.#eltToClose = eltToClose;
        this.#eltManager = eltManager;
        
         //on écoute le closer et on applique le closingProcess en cas de click
        closerElt.addEventListener('click', e => this.#closingProcess(e));

        //on écoute le body et on appelle onBodyClick en cas de click
        //pour pouvoir appeler le removeEventListener, on utilise un callable
        this.#callOnBodyClick = (e) => {
            this.#onBodyClick(e);
        }
        setTimeout(() => {
            document.body.addEventListener('click', this.#callOnBodyClick);
        }, 100);
    }
    
    //si le click est hors de l'élément, alors on applique le closingProcess
    /**
     * 
     * @param {Event} e 
     */    
    #onBodyClick(e) {
        if(!clickIsOnElement(e, this.#eltToClose)) {
            this.#closingProcess(e)
            document.body.removeEventListener('click', this.#callOnBodyClick);
            }
    }

    /**
     * 
     * @param {Event} e 
     */
    #closingProcess(e) {
        e.preventDefault();
        e.stopPropagation();
        this.#eltManager.close();
        document.body.removeEventListener('click', this.#callOnBodyClick);
    }
}



