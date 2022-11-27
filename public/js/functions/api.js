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