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

    /** @type {CloseHandler} */
    #closeHandler;

    /**
     * 
     * @param {string} openerSelector 
     */
    constructor(openerSelector) {
        this.#opener = document.querySelector(openerSelector);
        this.#template = document.querySelector(this.#opener.dataset.template);
        this.#container = document.querySelector(this.#opener.dataset.container);
        this.#closerSelector = this.#opener.dataset.closer;

        this.#opener.addEventListener('click', e => this.#onOpenerClick(e));
        console.log(this.#opener);
    }

    /**
     * 
     * @param {Event} e 
     */
    #onOpenerClick(e) {
        console.log(this.#opener);
        if(!this.#open) {
            this.#open = true;
            this.#info = this.#template.content.cloneNode(true).firstElementChild;
            this.#container.append(this.#info);
            this.#closeHandler = new CloseHandler(
                this.#info, 
                this,
                document.querySelector(this.#closerSelector)
                );
        }
    }

    close() {
        this.#info.remove();
        this.#open = false;
        this.#closeHandler.delete();
    }

}