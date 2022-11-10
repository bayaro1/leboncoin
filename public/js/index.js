document.querySelector('.hidden-nav-opener').addEventListener('click', function(e) {
    e.preventDefault();
    if(document.querySelector('.hidden-nav')) {
        document.querySelector('.hidden-nav').classList.add('visible');
    } else{
        const hidden_nav = document.createElement('nav');
        hidden_nav.classList.add('hidden-nav', 'visible');
        hidden_nav.append(document.querySelector('.navbar .top-nav').cloneNode(true));
        
        hidden_nav.querySelector('.hidden-nav-closer').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.hidden-nav').classList.remove('visible');
        })

        document.body.append(hidden_nav);
    }
})


// REFACTORISER TOUT ça EN METTANT LES PARAMETRES DANS LE BOUTON HIDDEN NAV OPENER DANS LE HTML