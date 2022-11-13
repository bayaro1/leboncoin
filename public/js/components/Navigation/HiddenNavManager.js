export class HiddenNavManager {

    /** @type {HTMLElement} */
    #hidden_nav;

    #callOnBodyClick;

    /** @type {boolean} */
    #initialized = false;


    /**
     * 
     * @param {HTMLElement} e 
     */
    constructor(hiddenNavClass) {
        this.#hidden_nav = document.querySelector(hiddenNavClass);
        document.querySelector(this.#hidden_nav.dataset.opener).addEventListener('click', e => this.#open());
    }
    
    #open() {
        if(!this.#initialized) {
            this.#hidden_nav.append(document.querySelector(this.#hidden_nav.dataset.content).cloneNode(true));
            this.#initialized = true;
        }
        this.#hidden_nav.classList.add('visible');
        document.body.classList.add('frozen');
        
        this.#callOnBodyClick = (e) => this.#onBodyClick(e);
        document.body.addEventListener('click', this.#callOnBodyClick);
        this.#hidden_nav.querySelector(this.#hidden_nav.dataset.closer).addEventListener('click', e => this.#close());
    }
    /**
     * 
     * @param {Event} e 
     */
    #close() {
        
        document.querySelector('.hidden-nav').classList.remove('visible');
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

}