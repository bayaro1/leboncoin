export class UrlManager {


    /** @type {string} */
    #path;

    /** @type {Object} */
    #params = {};

    /**
     * 
     * @param {string} path 
     */
    constructor(path) {
        if(path.includes('?')) {
            this.#path = path.split('?')[0];
            const params = path.split('?')[1];
            if(params.includes('&')) {
                for(const param of params.split('&')) {
                    this.#params[param.split('=')[0]] = param.split('=')[1];
                }
            } else {
                this.#params[params.split('=')[0]] = params.split('=')[1];
            }
        } else {
            this.#path = path;
        }

    }

    /**
     * 
     * @param {string} key 
     * @param {string} value 
     * @returns {UrlManager} self
     */
    setParam(key, value) {
        this.#params[key] = value;

        return this;
    }

    toString() {
        let url = this.#path;
        if(this.#params !== {}) {
            let stringParams = [];
            for(const [key, value] of Object.entries(this.#params)) {
                stringParams.push(key + '=' + value);
            }
            url += '?' + stringParams.join('&');
        }
        return url;
    }
}