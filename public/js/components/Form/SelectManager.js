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
        if(this.#select.querySelector('.select-option.default') && this.#select.querySelector('.current-choice-label').innerText === '') {
            this.#select.querySelector('.current-choice-label').innerText = this.#select.querySelector('.select-option.default').innerText;
            this.#select.dataset.currentchoicevalue = this.#select.querySelector('.select-option.default').dataset.value;
        }

        this.#select.addEventListener('click', e => this.#onClick(e));
        this.#listenChoice();
    }

    /**
     * 
     * @param {Event} e 
     */
    async #onClick(e) {
        if(this.#select.querySelector('.select-list').contains(e.target)) {
            return;
        }
        if(this.#open) {
            this.#close();
            return;
        }
        this.#select.querySelector('.select-list').classList.add('visible');
        this.#select.querySelector('.select-list').scroll(0, 0);
        this.#select.classList.add('focus');

        this.#open = true;

        this.#closeHandler = new CloseHandler(this.#select.querySelector('.select-list'));
        await this.#closeHandler.start();
        this.#close();
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
        this.#select.querySelector('.current-choice-label').innerHTML = e.currentTarget.cloneNode(true).innerHTML;

        this.#select.dataset.currentchoicevalue = e.currentTarget.dataset.value;
        if (this.#select.querySelector('input[type=hidden]')) {
            this.#select.querySelector('input[type=hidden]').value = e.currentTarget.dataset.value;
            this.#select.querySelector('input[type=hidden]').dispatchEvent(new Event('change'));
        }
        if(this.#select.querySelector('.default')) {
            this.#select.querySelector('.default').classList.remove('default');
        }
        e.currentTarget.classList.add('default');
        this.#close();
    }

    #close() {
        this.#select.querySelector('.select-list').classList.remove('visible');
        this.#open = false;
        this.#closeHandler.stop();
        this.#select.classList.remove('focus');
    }


}