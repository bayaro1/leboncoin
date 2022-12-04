import { hasSuchAncestor } from "../../functions/basics.js";
import { CloseHandler } from "../CloseHandler.js";
import { AutoSuggestor } from "./AutoSuggestor.js";

export class LocationManager {

    //type of event dispatched by locationManager
    static locationValidation = 'locationValidation';
    static locationRemove = 'locationRemove';
    //event to listen
    #change = 'change';
    #autoSuggestValidated = AutoSuggestor.autoSuggestValidated;
    #autoSuggestClose = AutoSuggestor.autoSuggestClose;
    #autoSuggestOpen = AutoSuggestor.autoSuggestOpen;

    //templates selectors
    #locationManagerTemplate = '#location-manager-template';
    #locationItemTemplate = '#location-choices-item-template';
    #locationBubbleTemplate = '#location-bubble-template';

    //elts selectors
    #locationManager = '.location-manager';
    #locationChoicesList = '.location-choices-list';
    #locationItem = '.location-choices-item';
    #validationButton = '.js-valid-button';
    #deleteButton = '.js-delete-button';
    #locationBubblesContainerSelector = '.location-bubbles-container';
    #locationBubble = '.location-bubble';
    #locationBubbleCloser = '.js-location-bubble-closer';
    #locationBubbleLabel = '.js-location-label';
    #locationRadiusBall = '.location-radius-ball';
    #locationRadiusBallLabel = '.location-radius-ball-label';
    #locationManagerRadius = '.location-manager-radius';
    #locationRadiusLine = '.location-radius-line';
    #locationRadiusActiveLine = '.location-radius-active-line';
    #locationRadiusOpener = '.location-radius-opener';

    //taille d'un caractère du label de la bubbleLocation
    #bubbleLabelCaracterWidth = 6.5;

    //radius mapping
    #radiusMapping = {
        0: 0,
        20: 10,
        40: 20,
        60: 50,
        80: 100,
        100: 200
    }


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
    
    /** @type {number} */
    #radius = 0;

    #status = 'close';

    #locationRadiusStatus = 'close';

    constructor(inputElt) {
        this.#inputElt = inputElt;
        this.#container = inputElt.parentElement;
        this.#box = document.querySelector(this.#locationManagerTemplate).content.cloneNode(true).firstElementChild;
        this.#container.append(this.#box);
        this.#locationBubblesContainer = this.#container.querySelector(this.#locationBubblesContainerSelector);
        this.#locationBubblesContainer.addEventListener('click', e => this.#onBubblesContainerClick(e));

        this.#autocomplete();

        for (const eventType of [
            this.#change,
            this.#autoSuggestValidated,
            this.#autoSuggestClose,
            this.#autoSuggestOpen
        ]) {
            this.#inputElt.addEventListener(eventType, e => this.#onEvent(e));
        }
        /*location radius*/
        this.#box.querySelector(this.#locationRadiusBall).addEventListener('mousedown', e => this.#onLocationRadiusBallMouseDown(e));
        this.activeLine = this.#box.querySelector(this.#locationRadiusActiveLine);
        this.line = this.#box.querySelector(this.#locationRadiusLine);
    }

    #autocomplete() {
        if(this.#inputElt.value !== '') {
            const values = this.#inputElt.value.split('_');
            for(const value of values) {
                const city = value.split(' ')[0];
                const postcode = value.split(' ')[1];
                let label = city + ' (' + postcode + ')';

                if(value.includes('r')) {
                    this.#radius = value.split('r')[1];
                    console.log(this.#radius);
                }
                this.#addSelectedLocation(label, value);
            }
            this.#insertBubbles();
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
                            this.#open(false);
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

    
    async #open(blank = true) {
        if(this.#status === 'open') {
            return;
        }
        let existingLabels = [];
        this.#box.querySelectorAll('.js-location-label')
                .forEach((locationLabel) => {
                    existingLabels.push(locationLabel.innerText);
                });
        for(const [label, value] of Object.entries(this.#selectedLocations)) {
            if(!existingLabels.includes(label)) {
                this.#box.querySelector(this.#locationChoicesList).prepend(
                    this.#createLocationItem(label)
                );
            }
        }
        if(blank) {
            this.#inputElt.value = '';
        }
        this.#box.classList.add('visible');
        this.#status = 'open';
        this.#inputElt.focus();
        if(Object.values(this.#selectedLocations).length === 1) {
            this.#openLocationRadius();
        } else {
            this.#closeLocationRadius();
        }
        this.#inputElt.setAttribute('placeholder', 'Saisissez une autre localisation');
        this.#startCloseHandler();
    }

    async #startCloseHandler() {
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
    async #onClose(closeEvent) {
        //si on a cliqué sur le input, la box reste ouverte et on relance un closeHandler
        if(closeEvent.target === this.#inputElt) {
            this.#startCloseHandler();
            return;
        }
        //si on a cliqué sur bouton supprimer, on vide les selectedLocations et on ferme la box
        if(closeEvent.target.classList.contains(this.#deleteButton.replace('.', ''))) {
            this.#selectedLocations = {};
            this.#radius = 0;
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
        if(Object.values(this.#selectedLocations).length === 1 && this.#radius !== 0) {
            this.#inputElt.value = values + ' r' + this.#radius;
        }
        else {
            this.#inputElt.value = values;
        }
        this.#inputElt.dispatchEvent(new CustomEvent(LocationManager.locationValidation, {bubbles: true}));
        //on ajoute les bubbles correspondantes
        this.#insertBubbles();
    }

    #insertBubbles() {
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
    }

    #onBubblesContainerClick(e) {
        if(!e.currentTarget.classList.contains('visible')) {
            return;
        }
        if(window.innerWidth < 1050 && !hasSuchAncestor(e.currentTarget, 'main-form-input-slider')) {
            this.#emptyBubblesContainer();
            this.#inputElt.dispatchEvent(new Event('click'));
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
        if(window.innerWidth < 1050 && !hasSuchAncestor(e.currentTarget, 'main-form-input-slider')) {
            this.#emptyBubblesContainer();
            this.#inputElt.dispatchEvent(new Event('click'));
            return;
        }
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
            this.#onValidation();
        } else {
            this.#inputElt.value = '';
            this.#radius = 0;
        }
        this.#inputElt.dispatchEvent(new CustomEvent(LocationManager.locationRemove, {bubbles: true}));
    }

    #createBubble(label, moreLocationsValue = null) {
        const labelWithoutRadius = label;
        if(Object.values(this.#selectedLocations).length === 1 && this.#radius !== 0) {                     //A REFACTORISER DANS UNE SEULE FCT POUR CREER UNE BUBBLE
            label += ' + ' + this.#radius + ' km';
        }
        const bubble = document.querySelector(this.#locationBubbleTemplate).content.cloneNode(true).firstElementChild;
        this.#bubbleLabelInnerText(bubble.querySelector(this.#locationBubbleLabel), label);
        bubble.setAttribute('title', label);
        bubble.dataset.label = labelWithoutRadius;
        if(moreLocationsValue !== null) {
            bubble.dataset.morevalue = moreLocationsValue;
        }
        bubble.querySelector(this.#locationBubbleCloser).addEventListener('click', e => this.#onBubbleClose(e));
        return bubble;
    }

    #createLocationItem(label) {
        const labelWithoutRadius = label;
        if(Object.values(this.#selectedLocations).length === 1 && this.#radius !== 0) {         //A REFACTORISER DANS UNE SEULE FCT POUR CREER UNE BUBBLE
            label += ' + ' + this.#radius + ' km';
        }
        const locationItem = document.querySelector(this.#locationItemTemplate).content.cloneNode(true).firstElementChild;
        this.#bubbleLabelInnerText(locationItem.querySelector(this.#locationBubbleLabel), label);
        locationItem.querySelector(this.#locationBubble).setAttribute('title', label);
        locationItem.querySelector(this.#locationBubble).dataset.label = labelWithoutRadius;
        locationItem.querySelector(this.#locationBubbleCloser).addEventListener('click', e => this.#onLocationItemClose(e));
        locationItem.querySelector(this.#locationRadiusOpener).addEventListener('click', e => this.#onLocationRadiusOpenerClick(e));
        return locationItem;
    }

    /**
     * 
     * @param {HTMLElement} elt 
     * @param {string} text 
     * @returns {string}
     */
    #bubbleLabelInnerText(elt, text) {
        const max_cars = (this.#container.getBoundingClientRect().width - 157) / this.#bubbleLabelCaracterWidth;
        if(text.length > max_cars) {
            text = text.substring(0, (max_cars - 3)) + '...';
        }
        elt.innerText = text;
    }

    #onLocationItemClose(e) {
        e.stopPropagation();
        const locationBubble = e.currentTarget.parentElement;

        let locations = {};
        for(const [label, value] of Object.entries(this.#selectedLocations)) {
            if(label !== locationBubble.dataset.label) {
                locations[label] = value;
            }
        }
        this.#selectedLocations = locations;
        locationBubble.parentElement.remove();
        if(Object.values(this.#selectedLocations).length === 0) {
            this.#close();
            this.#radius = 0;
        }
    }

    #close() {
        const locationItem = this.#locationItem;
        document.querySelectorAll(this.#locationManager).forEach(function(locationManager) {
            locationManager.classList.remove('visible');
            locationManager.querySelectorAll(locationItem)
                            .forEach((item) => {
                                item.remove();
                            })
        });
        this.#status = 'closed';
        this.#inputElt.setAttribute('placeholder', 'Saisissez une ville et un rayon');
    }

    //LOCATION RADIUS

    #onLocationRadiusOpenerClick(e) {
        if(this.#locationRadiusStatus === 'close') {
            if(Object.values(this.#selectedLocations).length > 1) {
                const alertMessage = document.createElement('div');
                alertMessage.classList.add('radius-opener-alert');
                alertMessage.innerText = 'Vous ne pouvez mettre un rayon que sur une seule localisation';
                e.currentTarget.parentElement.append(alertMessage);
                //on supprime l'alerte au premier click n'importe ou
                setTimeout(function() {
                    document.body.addEventListener('click', function(e) {
                        alertMessage.remove();
                    })
                }, 100);
                return;
            }
            this.#openLocationRadius();
        } else {
            this.#closeLocationRadius();
        }
    }
    #openLocationRadius() {
        this.#box.querySelector(this.#locationManagerRadius).classList.add('visible');
        this.#box.querySelector(this.#locationRadiusOpener).classList.add('open');
        this.#locationRadiusStatus = 'open';
        for(const [key, value] of Object.entries(this.#radiusMapping)) {
            if(value === parseInt(this.#radius)) {
                this.activeLine.style.width = key + '%';
                this.line.style.width = (100 - key) + '%';
                this.#box.querySelector(this.#locationRadiusBallLabel).innerText = this.#radius + ' km';
                return;
            }
        }
    }
    #closeLocationRadius() {
        this.#box.querySelector(this.#locationManagerRadius).classList.remove('visible');
        this.#box.querySelector(this.#locationRadiusOpener).classList.remove('open');
        this.#locationRadiusStatus = 'close';
        this.#radius = 0;
    }

     /**
     * 
     * @param {MouseEvent} e 
     */
      #onLocationRadiusBallMouseDown(e) {
        document.body.style.cursor = 'grabbing';

        this.callOnLocationRadiusMouseMove = e => this.#onLocationRadiusMouseMove(e);
        document.body.addEventListener('mousemove', this.callOnLocationRadiusMouseMove);
        document.body.addEventListener('mouseup', e => this.#onLocationRadiusBallMouseUp(e));
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
     #onLocationRadiusBallMouseUp(e) {
        this.#box.querySelector(this.#locationRadiusBall).classList.remove('active');
        document.body.removeEventListener('mousemove', this.callOnLocationRadiusMouseMove);
        document.body.style.cursor = 'default';
    }

    #onLocationRadiusMouseMove(e) {
        e.stopPropagation();
        e.preventDefault();
        const width = this.#box.querySelector(this.#locationManagerRadius).getBoundingClientRect().width;
        const mousePos = e.offsetX * 100 / width;

        if(mousePos < 10) {
            this.activeLine.style.width = '0';
            this.line.style.width = '100%';
            this.#radius = this.#radiusMapping[0];
            this.#box.querySelector(this.#locationRadiusBallLabel).innerText = this.#radius + ' km';
            return;
        } else if(mousePos >= 90) {
            this.activeLine.style.width = 'calc(100% - 24px)';
            this.line.style.width = '0';
            this.#radius = this.#radiusMapping[100];
            this.#box.querySelector(this.#locationRadiusBallLabel).innerText = this.#radius + ' km';
            return;
        }
        for (let index = 20; index <= 80; index+= 20) {
            if(mousePos >= (index - 10) && mousePos < (index + 10)) {
                this.activeLine.style.width = index + '%';
                this.line.style.width = (100 - index) + '%';
                this.#radius = this.#radiusMapping[index];
            }
        }
        this.#box.querySelector(this.#locationRadiusBallLabel).innerText = this.#radius + ' km';
    }
}
