export class InfoManager {

    /** @type {boolean} */
    #open = false;

    /** @type {HTMLElement} */
    #opener;

    /** @type {HTMLTemplateElement} */
    #template;

    /** @type {HTMLElement} */
    #container;

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

        console.log(this.#template);

        this.#opener.addEventListener('click', e => this.#onOpenerClick(e));
    }

    /**
     * 
     * @param {Event} e 
     */
    #onOpenerClick(e) {
        if(!this.#open) {
            this.#open = true;
            this.#info = this.#template.content.cloneNode(true).firstElementChild;
            this.#container.append(this.#info);
        }
    }

}