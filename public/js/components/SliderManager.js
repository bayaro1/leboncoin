import { CloseHandler } from "./CloseHandler.js";


export class SliderManager {

    /** @type {HTMLElement} */
    #slider;

    /** @type {string|null} */
    #initialized = null;

    /**
     * @param {string} sliderSelector 
     */
    constructor(sliderSelector) {
        this.#slider = document.querySelector(sliderSelector);
    }
    
    /**
     * 
     * @param {HTMLElement} opener
     */
    onOpenerClick(opener) {
        if(opener.dataset.maxwidth !== null && window.innerWidth > opener.dataset.maxwidth) {
            return;
        }
        
        if(opener.getAttribute('class') !== this.#initialized) {
            this.#slider.innerHTML = '';
            this.#slider.append(this.#getContent(opener));
            this.#initialized = opener.getAttribute('class');
        }

        if(!this.#slider.classList.contains('visible')) {
            
            this.#slider.classList.add('visible');
            if(opener.dataset.nofrozenatminwidth === undefined || opener.dataset.nofrozenatminwidth > window.innerWidth) {
                document.body.classList.add('frozen');
            }

            /*essayer de transformer ça en promise*/   //.then(e => this.close(e))
            new CloseHandler(
                this.#slider, 
                this.#slider.querySelector(opener.dataset.closer), 
                this
                );
        } else {
            this.close();
        }
    }

    close() {
        this.#slider.classList.remove('visible');
        document.body.classList.remove('frozen');
    }

    /**
     * 
     * @param {HTMLElement} opener 
     * @returns {Node}
     */
    #getContent(opener) {
        if(opener.dataset.content) {
            return document.querySelector(opener.dataset.content).cloneNode(true);
        } else if(opener.dataset.template) {
            return document.querySelector(opener.dataset.template).content.cloneNode(true);
        }
    }

}