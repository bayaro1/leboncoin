import { clickIsOnElement } from "../functions/spatial.js";

/**
 * renvoie une promise qui est resolved dès que l'utilisateur commande la fermeture de l'élément
 */
export class CloseHandler {

    /** @type {HTMLElement} */
    #eltToClose;

    /** @type {HTMLElement} */
    #closerElt;

    /** @type {callable} */
    #onBodyClick;

    #resolve;

    
    /**
     * @param {HTMLElement} eltToClose
     * @param {HTMLElement} closerElt
     */
    constructor(eltToClose, closerElt = null) {
        this.#eltToClose = eltToClose;
        this.#closerElt = closerElt;
    }
    
    start() {
        //on écoute le closer et on applique le closingProcess en cas de click
        if(this.#closerElt !== null) {
            this.#closerElt.addEventListener('click', e => this.#closingProcess(e));
        }

        //on écoute le body et on appelle onBodyClick en cas de click
        //pour pouvoir appeler le removeEventListener, on utilise un callable
        this.#onBodyClick = (e) => {
            if(!clickIsOnElement(e, this.#eltToClose)) {
                this.#closingProcess(e);
                }
        }
        setTimeout(() => {
            document.body.addEventListener('click', this.#onBodyClick);
        }, 100);

        //on retourne une promesse qui sera résolue lors de l'appel à closingProcess
        return new Promise((resolve, reject) => {
            this.#resolve = resolve;  
        });
    }
    
    stop() {
        document.body.removeEventListener('click', this.#onBodyClick);
    }


    //on résoud la promesse
    /**
     * 
     * @param {Event} e 
     */
    #closingProcess(e) {
        e.preventDefault();
        e.stopPropagation();
        document.body.removeEventListener('click', this.#onBodyClick);
        this.#resolve(e);
    }

}

