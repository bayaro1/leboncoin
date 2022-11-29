
import { CloseHandler } from "./CloseHandler.js";

export class InfoManager {

    /** @type {boolean} */
    #open = false;

    /** @type {HTMLElement} */
    #opener;

    /** @type {HTMLTemplateElement} */
    #template;

    /** @type {HTMLElement} */
    #container;

    /** @type {string} */
    #closerSelector;

    /** @type {HTMLElement} */
    #info;


    /**
     * 
     * @param {HTMLElement} opener 
     */
    constructor(opener) {
        this.#opener = opener;
        this.#template = document.querySelector(this.#opener.dataset.template);
        this.#container = document.querySelector(this.#opener.dataset.container);
        this.#closerSelector = this.#opener.dataset.closer;

        this.#opener.addEventListener('click', e => this.#onOpenerClick(e));
    }

    /**
     * 
     * @param {Event} e 
     */
    async #onOpenerClick(e) {
        if(!this.#open) {
            this.#open = true;
            this.#info = this.#template.content.cloneNode(true).firstElementChild;
            this.#container.append(this.#info);

            await (new CloseHandler(
                this.#info, 
                document.querySelector(this.#closerSelector)
            ))
            .start();
            this.#close();
        }
    }

    #close() {
        this.#info.remove();
        this.#open = false;
    }

}







// import { CloseHandler } from "./CloseHandler.js";

// export class InfoManager {

//     /** @type {boolean} */
//     #open = false;

//     /** @type {HTMLElement} */
//     #opener;

//     /** @type {HTMLTemplateElement} */
//     #template;

//     /** @type {HTMLElement} */
//     #container;

//     /** @type {string} */
//     #closerSelector;

//     /** @type {HTMLElement} */
//     #info;

//     /** @type {CloseHandler} */
//     #closeHandler;

//     /**
//      * 
//      * @param {HTMLElement} opener 
//      */
//     constructor(opener) {
//         this.#opener = opener;
//         this.#template = document.querySelector(this.#opener.dataset.template);
//         this.#container = document.querySelector(this.#opener.dataset.container);
//         this.#closerSelector = this.#opener.dataset.closer;

//         this.#opener.addEventListener('click', e => this.#onOpenerClick(e));
//     }

//     /**
//      * 
//      * @param {Event} e 
//      */
//     #onOpenerClick(e) {
//         if(!this.#open) {
//             this.#open = true;
//             this.#info = this.#template.content.cloneNode(true).firstElementChild;
//             this.#container.append(this.#info);
//             this.#closeHandler = new CloseHandler(
//                 this.#info, 
//                 this,
//                 document.querySelector(this.#closerSelector)
//                 );
//         }
//     }

//     close() {
//         this.#info.remove();
//         this.#open = false;
//         this.#closeHandler.delete();
//     }

// }