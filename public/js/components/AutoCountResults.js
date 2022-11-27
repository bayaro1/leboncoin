export class AutoCountResults {

    #formElt;

    #countElt;

    #countApi;

    #mapping;


    constructor(formElt) {
        this.#formElt = formElt;
        this.#countApi = this.#formElt.dataset.countapi;
        this.#mapping = JSON.parse(this.#formElt.dataset.mapping);
        this.#countElt = document.querySelector(this.#formElt.dataset.countresults);
        this.#formElt.addEventListener('change', e => this.#onChange(e))
    }

    #onChange(e) {
        const formData = new FormData(this.#formElt);
        let params = [];
        for(const fieldSelector of this.#mapping) {
            const elt = document.querySelector(fieldSelector);
            if(formData.get(elt.name) !== "" && formData.get(elt.name) !== null) {
                params.push(elt.name + '=' + formData.get(elt.name));
            }
        }
        const url = this.#countApi + '?' + params.join('&');
        const countElt = this.#countElt;
        fetch(url, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            }
        })
        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            countElt.innerText = new Intl.NumberFormat('fr-FR').format(value);
        })
        .catch(function(error) {
            console.error(error);
        })
    }
}


   