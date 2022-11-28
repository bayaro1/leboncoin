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


    #timer;

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
        
        if(this.#container.querySelector('.auto-suggest-list') === null) {
            this.#suggestList = this.#createList();
            this.#container.append(this.#suggestList);
            this.#inputElt.addEventListener('input', e => {
                clearInterval(this.#timer);
                const object = this;
                this.#timer = setTimeout(function() {
                    object.onInput(e);
                }, this.#timeout);
            });
        }
    }

    async onInput(e) {
        const q = e.target.value;
        if(q.length < this.#minQLength) {
            if(this.#open) {
                this.close();
            }
            return;
        }
        const url = (new UrlManager(this.#entryPoint))
                    .setParam('q', q.replace(' ', '+'))
                    .toString()
                    ;
        this.#container.classList.add('loading');


        try {
            const data = await myFetch(url, {
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            });
            this.#suggestList.innerHTML = '';
            if(this.#locationSuggestor) {
                if(data.features.length === 0 && this.#open) {
                    this.close();
                    return;
                }
                for(const feature of data.features) {
                    const label = feature.properties.name + ' (' + feature.properties.postcode + ')';
                    const value = feature.properties.name + ' ' + feature.properties.postcode;
                    this.#suggestList.append(this.#createItem(value, label))
                }
            } else {
                if(data.length === 0 && this.#open) {
                    this.close();
                    return;
                }
                for(const d of data) {
                    const label = d;
                    const value = d;
                    this.#suggestList.append(this.#createItem(value, label))
                }
            }
            this.#container.classList.remove('loading');
            if(!this.#open) {
                this.#openList();
            }
        } catch(e) {
            console.error(e);
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
        this.#inputElt.dispatchEvent(new Event('change', {'bubbles': true}));
        this.close();
    }

    #openList() {
        this.#suggestList.classList.add('visible');
        this.#closeHandler = new CloseHandler(this.#suggestList, this);
        this.#open = true;
    }

    close() {
        this.#suggestList.innerHTML = '';
        this.#suggestList.classList.remove('visible');
        this.#closeHandler.delete();
        this.#open = false;
    }
}
