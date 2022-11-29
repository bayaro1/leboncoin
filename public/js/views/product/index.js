
import { CloseHandler } from "../../components/CloseHandler.js";
import { clickIsOnElement } from "../../functions/spatial.js";
import { focusLightningOff, focusLightningOn } from "../../functions/style.js";





/*focus lightning sur le main-form dans main-searchpage*/

const onFormFocus = (e) => {
    if(window.innerWidth < 1050) {
        return;
    }
    if(e.target === document.querySelector('.main-searchpage .main-form .btn.btn-blue')) {
        return;
    }
    focusLightningOn(document.querySelector('.main-searchpage .main-form'));
    e.currentTarget.removeEventListener('click', onFormFocus);
    e.target.focus();

    (new CloseHandler(document.querySelector('.main-searchpage .main-form .form-row:first-of-type')))
    .start()
    .then((e) => {
        focusLightningOff(document.querySelector('.main-searchpage .main-form'));
        document.querySelector('.main-searchpage .main-form .form-row:first-child').addEventListener('click', onFormFocus);
    });
}

document.querySelector('.main-searchpage .main-form .form-row:first-child').addEventListener('click', onFormFocus);


/*favorite*/
const onFavoriteClick = e => {
    e.preventDefault();
    e.currentTarget.parentElement.parentElement.classList.toggle('in-cart');
}
document.querySelectorAll('.product-card-favorite')
        .forEach(favorite => {
            favorite.addEventListener('click', onFavoriteClick);
        });



/*save-search & scroll*/
const max_scroll = document.body.getBoundingClientRect().height - document.querySelector('.footer-block').getBoundingClientRect().height - window.innerHeight;
const min_scroll = max_scroll - document.querySelector('.results-list').getBoundingClientRect().height;
document.addEventListener('scroll', function(e) {
    if(window.scrollY > min_scroll + window.innerHeight && window.scrollY < max_scroll - window.innerHeight) {
        document.querySelector('.save-search-sticky').classList.add('small');
    } else {
        document.querySelector('.save-search-sticky').classList.remove('small');
    }
});



/**sort**/ 
document.querySelector('.search-sort-input').addEventListener('change', function(e) {
    const form = document.querySelector('.main-searchpage .main-form');
    form.submit();
    form.dispatchEvent(new Event('submit'));
});

