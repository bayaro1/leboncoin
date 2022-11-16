import { clickIsOnElement } from "../functions/spatial.js";


export class CloseHandler {

    /** @type {HTMLElement} */
    #eltToClose;

    /** @type {callable} */
    #closingProcess;

    /** @type {callable} */
    #callOnBodyClick;

    /** @type {Object|null} */
    #eltManager;

    /**
     * @param {HTMLElement} eltToClose
     * @param {HTMLElement} closerElt 
     * @param {callable} closingProcess closingProcess(e, eltToClose, eltManager = null)
     * @param {Object|null} eltManager
     */
    constructor(eltToClose, closerElt, closingProcess, eltManager = null) {

        this.#eltToClose = eltToClose;
        this.#closingProcess = closingProcess;
        this.#eltManager = eltManager;
        
         //on écoute le closer et on applique le closingProcess en cas de click
        closerElt.addEventListener('click', e => this.#launchClosingProcess(e));

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
            this.#launchClosingProcess(e)
            document.body.removeEventListener('click', this.#callOnBodyClick);
            }
    }

    /**
     * 
     * @param {Event} e 
     */
    #launchClosingProcess(e) {
        e.preventDefault();
        e.stopPropagation();
        this.#closingProcess(e, this.#eltToClose, this.#eltManager);
        document.body.removeEventListener('click', this.#callOnBodyClick);
    }
}



