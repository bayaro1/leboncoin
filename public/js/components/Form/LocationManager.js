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
        this.#open();
    }

    async #open() {
        for(const [label, _] of Object.entries(this.#selectedLocations)) {
            this.#box.querySelector('.location-choices-list').prepend(
                this.#createLocationItem(label)
            );
        }
        this.#box.classList.add('visible');

        //on écoute un closeEvent
        const closeEvent = await (new CloseHandler(
            this.#box, 
            this.#box.querySelector('.js-valid-button'), 
            this.#box.querySelector('.js-delete-button')
        )).start();
        this.#onClose(closeEvent);
    }

    /**
     * 
     * @param {Event} closeEvent 
     * @returns 
     */
    #onClose(closeEvent) {
        //si on a cliqué sur le input, la box reste ouverte
        if(closeEvent.target === this.#inputElt) {
            //par contre si le autoSuggestor s'ouvre, la box doit se fermer
            const onInput = e => {                                                      //PARTIE A REFACTORISER <<<<<=========================
                if(e.currentTarget.value.length >= 3) {
                    this.#close();
                    this.#inputElt.removeEventListener('input', onInput);
                    const onAutoSuggestCloseWithoutChoice = e => {
                        this.#onValidation();
                        this.#inputElt.removeEventListener('autoSuggestCloseWithoutChoice', onAutoSuggestCloseWithoutChoice);
                    }
                    this.#inputElt.addEventListener('autoSuggestCloseWithoutChoice', onAutoSuggestCloseWithoutChoice);
                }
            }
            this.#inputElt.addEventListener('input', onInput);
            return;
        }
        //si on a cliqué sur bouton supprimer, on vide les selectedLocations et on ferme la box
        if(closeEvent.target.value === 'delete') {
            this.#selectedLocations = {};
        }
        //si on a cliqué sur valider, ou hors de la box, on valide les selectedLocations
        else {
            this.#onValidation();
        }
        this.#close(); 
    }

    #onValidation() {
        //on remplit l'input avec les données
        let values = Object.values(this.#selectedLocations).join('_');
        this.#inputElt.setAttribute('value', values);
        this.#inputElt.value = values;

        //affichage des bubbles
        this.#container.querySelectorAll('.location-bubble').forEach(function(bubble) { bubble.remove() });
        const labels = Object.keys(this.#selectedLocations);
        const count = labels.length;
        this.#container.querySelector('.location-bubbles-container').append(this.#createBubble(labels[count - 1]));
        if(count > 1) {
            const moreLocationsLabel = '+ '+ (count - 1);
            this.#container.querySelector('.location-bubbles-container').append(this.#createBubble(moreLocationsLabel));
        }
        this.#container.querySelector('.location-bubbles-container').classList.add('visible');
        this.#inputElt.style.color = 'transparent';

        this.#container.querySelector('.location-bubbles-container').addEventListener('click', e => this.#open());
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
        document.querySelectorAll('.location-manager').forEach(function(locationManager) {
            locationManager.classList.remove('visible');
            locationManager.querySelectorAll('.location-choices-item')
                            .forEach((item) => {
                                item.remove();
                            })
        });
    }
}
