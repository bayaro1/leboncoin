export class SliderManager {

    /** @type {HTMLElement} */
    #slider;

    /** @type {string} */
    #openerSelector;

    /** @type {string} */
    #closerSelector;

    /** @type {string|null} */
    #initialized = null;

    /** @type {boolean} */
    #closeWithBodyClick;

    /**callable */
    #callOnBodyClick;


    /**
     * @param {string} sliderSelector 
     */
    constructor(sliderSelector) {
        this.#slider = document.querySelector(sliderSelector);
    }

    /**
     * @param {Node} identifier
     * @param {Node} content 
     * @param {string} openerSelector 
     * @param {string} closerSelector 
     * @param {boolean} closeWithBodyClick si on peut ou non fermer en appuyant à côté du slider
     */
    manage(
        openerSelector,
        closerSelector,
        closeWithBodyClick = false
    ) {
        this.#openerSelector = openerSelector;
        this.#closerSelector = closerSelector;
        this.#closeWithBodyClick = closeWithBodyClick;

        document.querySelector(this.#openerSelector).addEventListener('click', e => this.#open(e));
    }
    
    /**
     * 
     * @param {Event} e 
     */
    #open(e) {
        console.log(e.currentTarget.dataset.maxwidth);
        if(e.currentTarget.dataset.maxwidth !== null && window.innerWidth > e.currentTarget.dataset.maxwidth) {
            return;
        }
        if(e.currentTarget.getAttribute('class') !== this.#initialized) {
            this.#slider.innerHTML = '';
            this.#slider.append(this.#getContent(e.currentTarget));
            this.#initialized = e.currentTarget.getAttribute('class');
        }
        this.#slider.classList.add('visible');
        document.body.classList.add('frozen');
        
        this.#callOnBodyClick = (e) => this.#onBodyClick(e);
        if(this.#closeWithBodyClick) {
            document.body.addEventListener('click', this.#callOnBodyClick);
        }
        this.#slider.querySelector(this.#closerSelector).addEventListener('click', e => this.#close());
    }
    /**
     * 
     * @param {Event} e 
     */
    #close() {
        
        this.#slider.classList.remove('visible');
        document.body.classList.remove('frozen');
        document.body.removeEventListener('click', this.#callOnBodyClick);
    }

    /**
     * 
     * @param {Event} e 
     */
    #onBodyClick(e) {
        if(window.innerWidth > 620 && e.clientX > 482) {
            this.#close();
        }
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