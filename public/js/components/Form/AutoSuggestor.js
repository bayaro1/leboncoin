import { myFetch } from "../../functions/api.js";
import { CloseHandler } from "../CloseHandler.js";
import { UrlManager } from "../Tools/UrlManager.js";

export class AutoSuggestor {

    /** @type {HTMLElement} */
    #inputElt;

    /** @type {string} */
    #entryPoint;

    /** @type {number} */
    #minQLength;
   
    /** @type {HTMLElement} */
    #container;

    /** @type {HTMLElement} */
    #suggestList

    /** @type {CloseHandler} */
    #closeHandler

    /** @type {boolean} */
    #open = false;

    /** @type {boolean} */
    #locationSuggestor = false;

    /** @type {AbortController} */
    #controller;

    /** @type {number} timestamp (ms)*/
    #lastFetchCall;

    /** @type {number} (ms) */
    #timeout = 300;

    /**
     * 
     * @param {HTMLElement} inputElt 
     */
    constructor(inputElt) {
        this.#inputElt = inputElt;
        if(this.#inputElt.dataset.locationsuggestor) {
            this.#locationSuggestor = true;
        }
        this.#entryPoint = this.#inputElt.dataset.entrypoint;
        this.#minQLength = this.#inputElt.dataset.minqlength;
        this.#container = this.#inputElt.parentElement;

        this.#suggestList = this.#createList();
        this.#container.append(this.#suggestList);

        this.#inputElt.addEventListener('input', e => {
            this.#onInput(e);
        });
    }

    async #onInput(e) {
        if(Date.now() - this.#lastFetchCall < this.#timeout) {
            this.#controller.abort();
        }

        const q = e.target.value;
        if(q.length < this.#minQLength) {
            if(this.#open) {
                this.#close();
            }
            return;
        }
        this.#inputElt.dispatchEvent(new CustomEvent('autoSuggestOpen'));
        this.#container.classList.add('loading');

        const data = await this.#callApi(q);
        this.#loadList(data);

        this.#container.classList.remove('loading');
        if(!this.#open) {
            this.#openList();
        }
    }

    #callApi(q) {

        const url = (new UrlManager(this.#entryPoint))
                    .setParam('q', q.replace(' ', '+'))
                    .toString()
                    ;

        this.#controller = new AbortController();
        this.#lastFetchCall = Date.now();
        try {
            return myFetch(url, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                signal: this.#controller.signal
            });
        } catch(e) {
            console.error(e);
        }
    }

    async #loadList(data) {
        this.#suggestList.innerHTML = '';
        if(this.#locationSuggestor) {
            if(data.features.length === 0 && this.#open) {
                this.#close();
                return;
            }
            for(const feature of data.features) {
                const label = feature.properties.name + ' (' + feature.properties.postcode + ')';
                const value = feature.properties.name + ' ' + feature.properties.postcode;
                this.#suggestList.append(this.#createItem(value, label))
            }
        } else {
            if(data.length === 0 && this.#open) {
                this.#close();
                return;
            }
            for(const d of data) {
                const label = d;
                const value = d;
                this.#suggestList.append(this.#createItem(value, label))
            }
        }
    }

    /**
     * 
     * @returns {HTMLElement}
     */
    #createList() {
        const list = document.createElement('ul');
        list.classList.add('auto-suggest-list');
        return list;
    }

    /**
     * 
     * @param {string} value 
     * @param {string} label 
     * @returns {HTMLElement}
     */
    #createItem(value, label) {
        const item = document.createElement('li');
        item.classList.add('auto-suggest-item');
        item.setAttribute('value', value);
        item.innerText = label;
        item.addEventListener('click', e => this.#onChoice(e))
        return item;
    }


    #onChoice(e) {
        this.#inputElt.value = e.currentTarget.getAttribute('value');
        this.#inputElt.setAttribute('label', e.currentTarget.innerText);
        this.#inputElt.dispatchEvent(new CustomEvent('autoSuggestValidated', {bubbles: false}));
        this.#close();
    }

    async #openList() {
        this.#suggestList.classList.add('visible');
        this.#open = true;

        this.#closeHandler = new CloseHandler(this.#suggestList);
        await this.#closeHandler.start();
        this.#close();
    }

    #close() {
        this.#inputElt.dispatchEvent(new CustomEvent('autoSuggestClose'));
        this.#suggestList.innerHTML = '';
        this.#suggestList.classList.remove('visible');
        this.#closeHandler.stop();
        this.#open = false;
        this.#controller.abort();
        this.#container.classList.remove('loading');
    }
}
