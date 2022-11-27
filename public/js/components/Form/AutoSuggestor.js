import { myFetch } from "../../functions/api.js";

export class AutoSuggestor {

    /** @type {HTMLElement} */
    #inputElt;

    /** @type {string} */
    #entryPoint;
   
    /** @type {HTMLTemplateElement} */
    #suggestTemplate

    #minQLength;

    /**
     * 
     * @param {HTMLElement} inputElt 
     */
    constructor(inputElt) {
        this.#inputElt = inputElt;
        this.#entryPoint = this.#inputElt.dataset.entrypoint;
        this.#suggestTemplate = document.querySelector(this.#inputElt.dataset.suggesttemplate);
        this.#minQLength = this.#inputElt.dataset.minqlength;

        this.#inputElt.addEventListener('input', e => this.#onInput(e));
    }

    /**
     * 
     * @param {Event} e 
     */
    async #onInput(e) {
        const q = e.currentTarget.value;
        if(q.length < this.#minQLength) {
            return;
        }
        const url = this.#entryPoint + q.replace(' ', '+');
        try {
            const data = await myFetch(url, {
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            });
            const items = [];
            for(const feature of data.features) {
                items.push({
                    label: feature.properties.name + ' ('+feature.properties.postcode+')',
                    value: feature.properties.name + '+' + feature.properties.postcode
                });
            }
            this.#createList(items);
        } catch(e) {
            console.error(e);
        }
    }

    /**
     * 
     * @param {{label: string, value: string}[]} items 
     */
    #createList(items) {
        const listElt = this.#suggestTemplate.content.cloneNode(true).firstElementChild;
        const itemElt = listElt.querySelector('.auto-suggest-item');
        for(const item of items) {
            const currentItemElt = itemElt.cloneNode(true);
            currentItemElt.innerText = item.label;
            currentItemElt.dataset.value = item.value;
            listElt.append(currentItemElt); 
        }
        itemElt.remove();
        this.#position(listElt);
    }

    /**
     * 
     * @param {HTMLElement} listElt 
     */
    #position(listElt) {
        this.#inputElt.style.position = 'relative';
        listElt.style.position = 'absolute';
        listElt.style.zIndex = '8';
        listElt.style.top = '100%';
        listElt.style.left = '0';
        listElt.style.right = '0';
        listElt.style.height = '100px';
        listElt.style.bottom = 'auto';
        listElt.style.border = 'solid 1px black';

        this.#inputElt.append(listElt);
    }
}
