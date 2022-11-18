import { CloseHandler } from "../CloseHandler.js";

export class SelectManager {
    
    /** @type {HTMLElement} */
    #select;

    /** @type {boolean} */
    #open = false;

    /** @type {CloseHandler} */
    #closeHandler;

    
    /**
     * 
     * @param {HTMLElement} select 
     * @param {string} optionsTemplateSelector 
     */
    constructor(select, optionsTemplateSelector) {
        this.#select = select;
        this.#select.append(document.querySelector(optionsTemplateSelector).content.cloneNode(true));
        this.#select.querySelector('.current-choice-label').innerText = this.#select.querySelector('.select-option.default').innerText;

        this.#select.addEventListener('click', e => this.#onClick(e));
    }

    /**
     * 
     * @param {Event} e 
     */
    #onClick(e) {
        if(this.#select.querySelector('.select-list').contains(e.target)) {
            return;
        }
        if(this.#open) {
            this.close();
            return;
        }

        this.#select.querySelector('.select-list').classList.add('visible');
        this.#select.querySelector('.select-list').scroll(0, 0);
        this.#select.classList.add('focus');

        this.#open = true;

        this.#listenChoice();
        this.#closeHandler = new CloseHandler(this.#select.querySelector('.select-list'), this);
    }

    #listenChoice() {
        const selectManager = this;
        this.#select.querySelectorAll('.select-option')
                    .forEach(function(option) {
                        option.addEventListener('click', e => selectManager.onChoice(e))
                    })
    }

    /**
     * 
     * @param {Event} e 
     */
    onChoice(e) {
        e.stopPropagation();
        this.#select.querySelector('.current-choice-label').innerText = e.currentTarget.innerText;
        this.close();
    }

    close() {
        this.#select.querySelector('.select-list').classList.remove('visible');
        this.#open = false;
        this.#closeHandler.delete();
        this.#select.classList.remove('focus');
    }


}