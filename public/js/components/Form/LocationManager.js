import { CloseHandler } from "../CloseHandler.js";

export class LocationManager {

    /** @type {HTMLElement} */
    #inputElt;

    /** @type {HTMLElement} */
    #container;

    /** @type {HTMLElement} */
    #box;

    /** @type {Object} {label: value, label: value, etc...} */
    #selectedLocations = {};

    constructor(inputElt, eventName) {
        this.#inputElt = inputElt;
        this.#container = inputElt.parentElement;
        this.#box = document.querySelector('#location-manager-template').content.cloneNode(true).firstElementChild;
        this.#container.append(this.#box);

        this.#inputElt.addEventListener(eventName, e => this.#onEvent(e))
    }

    async #onEvent(e) {
        const label = this.#inputElt.getAttribute('label');
        const value = this.#inputElt.value;

        if(!Object.values(this.#selectedLocations).includes(value)) {
            this.#selectedLocations[label] = value;
        }

        for(const [label, _] of Object.entries(this.#selectedLocations)) {
            this.#box.querySelector('.location-choices-list').prepend(
                this.#createLocationItem(label)
            );
        }
        this.#box.classList.add('visible');
        const closeEvent = await  (new CloseHandler(this.#box, this.#box.querySelector('.js-valid-button'))).start();
        console.log(closeEvent.target);
        if(closeEvent.target.value === 'valid') {
            this.#onValidation();
        } // sinon c'est le comportement normal = suppression de la valeur du input
        this.#close(); 
    }
    #onValidation() {
        //on remplit l'input avec les données
        let values = Object.values(this.#selectedLocations).join('_');
        this.#inputElt.setAttribute('value', values);
        this.#inputElt.value = values;
        this.#inputElt.classList.add('invisible');

        //affichage des bubbles
        const labels = Object.keys(this.#selectedLocations);
        const count = labels.length;
        this.#container.append(this.#createBubble(labels[count - 1]));
        if(count > 1) {
            let moreLocationsLabel = '+ '+ (count - 1);
            if(count > 2) {
                moreLocationsLabel += 'autres localisations...';
            } else {
                moreLocationsLabel += 'autre localisation...';
            }
            this.#container.append(this.#createBubble(moreLocationsLabel));
        }
        //ajouter listeners sur les croix des bubbles
    }

    #createBubble(label) {
        const bubble = document.querySelector('#location-bubble-template').content.cloneNode(true).firstElementChild;
        bubble.querySelector('.js-location-label').innerText = label;
        return bubble;
    }

    #createLocationItem(label) {
        const locationItem = document.querySelector('#location-choices-item-template').content.cloneNode(true).firstElementChild;
        locationItem.querySelector('.js-location-label').innerText = label;
        return locationItem;
    }

    #close() {
        this.#box.classList.remove('visible');
        this.#box.querySelectorAll('.location-choices-item')
                .forEach((item) => {
                    item.remove();
                })
    }
}
