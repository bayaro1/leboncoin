import { myFetch } from "../../functions/api.js";
import { UrlManager } from "../Tools/UrlManager.js";
import { AutoSuggestor } from "./AutoSuggestor.js";
import { LocationManager } from "./LocationManager.js";

export class AutoCountResults {

    /** @type {HTMLElement} */
    #formElt;

    /** @type {HTMLElement} */
    #countElt;

    /** @type {string} */
    #countApi;

    /** @type {array} */
    #mapping;

    /**
     * 
     * @param {HTMLElement} formElt 
     * @param {array} eventsToListen 
     */
    constructor(formElt, eventsToListen) {
        this.#formElt = formElt;
        this.#countApi = this.#formElt.dataset.countapi;
        this.#mapping = JSON.parse(this.#formElt.dataset.mapping);
        // Si il y a un élément countResult dans le form, on choisit celui-là, sinon on recherche le countResult dans le document global
        if(this.#formElt.querySelector(this.#formElt.dataset.countresults)) {
            this.#countElt = this.#formElt.querySelector(this.#formElt.dataset.countresults);
        } else {
            this.#countElt = document.querySelector(this.#formElt.dataset.countresults);
        }

        for(const changeEvent of eventsToListen) {
            this.#formElt.addEventListener(changeEvent, e => this.#onChange(e))
        }
    }

    async #onChange(e) {
        const formData = new FormData(this.#formElt);

        const urlManager = new UrlManager(this.#countApi);
        for(const fieldSelector of this.#mapping) {
            const elt = document.querySelector(fieldSelector);
            if(formData.get(elt.name) !== "" && formData.get(elt.name) !== null) {
                urlManager.setParam(elt.name, formData.get(elt.name));
            }
        }
        const countElt = this.#countElt;
        try {
            const value = await myFetch(urlManager.toString(), {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            countElt.innerText = new Intl.NumberFormat('fr-FR').format(value);
        } catch(e) {
            console.error(e);
        }
    }
}


   