import { CloseHandler } from "./CloseHandler.js";

export class InfoManager {

    /** @type {boolean} */
    open = false;

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
     * @param {string} openerSelector 
     */
    constructor(openerSelector) {
        this.#opener = document.querySelector(openerSelector);
        this.#template = document.querySelector(this.#opener.dataset.template);
        this.#container = document.querySelector(this.#opener.dataset.container);
        this.#closerSelector = this.#opener.dataset.closer;

        this.#opener.addEventListener('click', e => this.#onOpenerClick(e));
    }

    /**
     * 
     * @param {Event} e 
     */
    #onOpenerClick(e) {
        if(!this.open) {
            this.open = true;
            this.#info = this.#template.content.cloneNode(true).firstElementChild;
            this.#container.append(this.#info);
            new CloseHandler(this.#info, document.querySelector(this.#closerSelector), this.#close, this);
        }
    }

    #close(e, info, eltManager) {
        info.remove();
        eltManager.open = false;
    }

}