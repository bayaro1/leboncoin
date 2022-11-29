/**
 * 
 * @param {string} url 
 * @param {Object} options 
 */
export async function myFetch(url, options) {
    const res = await fetch(url, options);
    if(res.ok) {
        return await res.json();
    }
    throw new Error('server error');
}



/**
 * 
 * @param {string} url 
 * @param {Object} options 
 */
export async function fetchCancellable(url, options = {}) {
    const controller = new AbortController();
    const promise = fetch(
        url,
        { ...options, signal: controller.signal}
    );
    const cancel = () => controller.abort();
    return [promise, cancel];
}



/*a revoir*/

const throwOnTimeout = (timeout) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout'));
        }, timeout);
    });
};


export async function fetchWithTimeout(url, options = {}) {
    const { timeout, ...remainingOptions } = options;
    const res = null;
    if(timeout) {
        res = await Promise.race(
            fetch(url, remainingOptions),
            throwOnTimeout(timeout)
        );
    }
    else {
        res = await fetch(url, options);
    }
    if(res.ok) {
        return res.json();
    }
    throw new Error('erreur serveur');
};