import { CloseHandler } from "../CloseHandler.js";

export class LocationManager {

    //event to listen
    #change = 'change';
    #autoSuggestValidated = 'autoSuggestValidated';
    #autoSuggestClose = 'autoSuggestClose';
    #autoSuggestOpen = 'autoSuggestOpen';

    //templates selectors
    #locationManagerTemplate = '#location-manager-template';

    //elts selectors
    #locationChoicesList = '.location-choices-list';
    #validationButton = '.js-valid-button';
    #deleteButton = '.js-delete-button';
    #locationBubblesContainerSelector = '.location-bubbles-container';
    #locationBubble = '.location-bubble';
    #locationBubbleCloser = '.js-location-bubble-closer';

    /** @type {HTMLElement} */
    #inputElt;

    /** @type {HTMLElement} */
    #container;

    /** @type {HTMLElement} */
    #box;

    /** @type {HTMLElement} */
    #locationBubblesContainer;

    /** @type {Object} {label: value, label: value, etc...} */
    #selectedLocations = {};

    #status = 'close';

    constructor(inputElt) {
        this.#inputElt = inputElt;
        this.#container = inputElt.parentElement;
        this.#box = document.querySelector(this.#locationManagerTemplate).content.cloneNode(true).firstElementChild;
        this.#container.append(this.#box);
        this.#locationBubblesContainer = this.#container.querySelector(this.#locationBubblesContainerSelector);
        this.#locationBubblesContainer.addEventListener('click', e => this.#onBubblesContainerClick(e));

        // if(this.#inputElt.value) {
        //     //récupérer le value du input
        //     this.#insertBubbles();
        // }

        for (const eventType of [
            this.#change,
            this.#autoSuggestValidated,
            this.#autoSuggestClose,
            this.#autoSuggestOpen
        ]) {
            this.#inputElt.addEventListener(eventType, e => this.#onEvent(e));
        }
    }

    /**
     * 
     * @param {string} label 
     * @param {string} value 
     */
    #addSelectedLocation(label, value) {
        if(!Object.values(this.#selectedLocations).includes(value)) {
            this.#selectedLocations[label] = value;
        }
    }

    /**
     * 
     * @param {Event} e 
     */
    #onEvent(e) {
        switch (e.type) {
            case this.#change:
                e.currentTarget.value = '';
                break;

                case this.#autoSuggestOpen:
                        if(this.#status === 'open') {
                            this.#close();
                        }
                        break;
            
                    case this.#autoSuggestClose:
                            this.#open();
                            break;
                
                        case this.#autoSuggestValidated:
                            this.#addSelectedLocation(
                                this.#inputElt.getAttribute('label'),
                                this.#inputElt.value
                            )
                            this.#open();
                            break;
            default:
                break;
        }
    }

    
    async #open() {
            for(const [label, _] of Object.entries(this.#selectedLocations)) {
                this.#box.querySelector(this.#locationChoicesList).prepend(
                    this.#createLocationItem(label)
                );
            }
        this.#inputElt.value = '';
        this.#box.classList.add('visible');
        this.#status = 'open';

        //on écoute un closeEvent
        const closeEvent = await (new CloseHandler(
            this.#box, 
            this.#box.querySelector(this.#validationButton), 
            this.#box.querySelector(this.#deleteButton)
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
            return;
        }
        //si on a cliqué sur bouton supprimer, on vide les selectedLocations et on ferme la box
        if(closeEvent.target.classList.contains(this.#deleteButton.replace('.', ''))) {
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
        //on ajoute les bubbles correspondantes
        this.#insertBubbles();
    }

    #insertBubbles() {
        //affichage des bubbles
        this.#container.querySelectorAll(this.#locationBubble).forEach(function(bubble) { bubble.remove() });
        let labels = Object.keys(this.#selectedLocations);

        this.#locationBubblesContainer.append(this.#createBubble(labels.pop()));
        if(labels.length > 0) {
            const moreLocationsLabel = '+ '+ (labels.length);
            const moreLocationsValue = labels.join('_');
            this.#locationBubblesContainer.append(this.#createBubble(moreLocationsLabel, moreLocationsValue));
        }
        this.#locationBubblesContainer.classList.add('visible');
        this.#inputElt.classList.add('full');

        //listener sur les bubbles
        for(const bubbleCloser of this.#container.querySelectorAll(this.#locationBubbleCloser)) {
            bubbleCloser.addEventListener('click', e => this.#onBubbleClose(e));
        }
    }

    #onBubblesContainerClick(e) {
        if(!e.currentTarget.classList.contains('visible')) {
            return;
        }
        this.#emptyBubblesContainer();
        this.#open();
    }

    #emptyBubblesContainer() {
        this.#locationBubblesContainer.classList.remove('visible');
        this.#inputElt.classList.remove('full');
        this.#inputElt.value = '';
    }

    #onBubbleClose(e) {
        e.stopPropagation();
        const locationBubble = e.currentTarget.parentElement;
        let labels = [];
        if(locationBubble.dataset.morevalue !== undefined) {
            labels = locationBubble.dataset.morevalue.split('_');
        } else {
            labels = [locationBubble.dataset.label];
        }
        let locations = {};
        for(const [label, value] of Object.entries(this.#selectedLocations)) {
            if(!labels.includes(label)) {
                locations[label] = value;
            }
        }
        this.#selectedLocations = locations;
        locationBubble.remove();
        
        this.#emptyBubblesContainer();
        if(Object.values(this.#selectedLocations).length > 0) {
            this.#insertBubbles();
        }
    }

    #createBubble(label, moreLocationsValue = null) {
        const bubble = document.querySelector('#location-bubble-template').content.cloneNode(true).firstElementChild;
        bubble.querySelector('.js-location-label').innerText = label;
        bubble.dataset.label = label;
        if(moreLocationsValue !== null) {
            bubble.dataset.morevalue = moreLocationsValue;
        }
        return bubble;
    }

    #createLocationItem(label) {
        const locationItem = document.querySelector('#location-choices-item-template').content.cloneNode(true).firstElementChild;
        locationItem.querySelector('.js-location-label').innerText = label;
        return locationItem;
    }

    #close() {
        document.querySelectorAll('.location-manager').forEach(function(locationManager) {
            locationManager.classList.remove('visible');
            locationManager.querySelectorAll('.location-choices-item')
                            .forEach((item) => {
                                item.remove();
                            })
        });
        this.#status = 'closed';
    }
}
