var userID = '';

function ajax(route, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", route, true);
    xhttp.send();
}

new Fingerprint2().get(function (result, components) {
    userID = result;
});

function favorite(elem) {
    if (elem.querySelector('i').classList.contains('uk-icon-star-o')) {
        elem.querySelector('i').classList.remove('uk-icon-star-o');
        elem.querySelector('i').classList.add('uk-icon-star');
        setFavorite(elem.previousSibling.innerHTML.split(" ").join("-"));
    }

}

function setFavorite(fav) {
    ajax('/favorite/' + userID + '/' + fav, function (res) {
        //check operation
    })
}

function getFavorites() {
    console.log('userid: ' + userID);
    ajax('/favorites/' + userID, function (res) {
        var favs = JSON.parse(res);
        favs.favorites.forEach(function(e){
            console.log(e);
        });
    })
}

function link_estrella(links) {
    links.forEach(function (el) {
        var anime = el.text.split(" ");
        var episode = anime.pop();
        anime = anime.join(" ");
        var obj = {
            text: el.text,
            link: { anime: anime, episode: episode }
        };
        dust.renderSource(document.getElementById("DUST_lista_estrella").textContent, obj, function (err, out) {
            document.getElementById("lista_estrella").innerHTML += out;
        });
    });
}

function anime_not(animes) {
    animes.forEach(function (el) {
        var obj = {
            image: el.image,
            text: el.anime.split('-').join(' ') + ' ' + el.episode,
            link: { anime: el.anime.split('-').join(' '), episode: el.episode }
        };
        dust.renderSource(document.getElementById("DUST_not_container").textContent, obj, function (err, out) {
            document.getElementById("not-container").innerHTML += out;
        });
    });
}

function main_list() {
    dust.renderSource(document.getElementById("DUST_main_list").textContent, {}, function (err, out) {
        document.getElementsByTagName("main")[0].innerHTML = out;
    });
    load_main();
}

function main_video(anime) {
    dust.renderSource(document.getElementById("DUST_main_video").textContent, anime, function (err, out) {
        document.getElementsByTagName("main")[0].innerHTML = out;
    });
}


function load_main() {
    ajax('/animes', function (res) {
        var response = JSON.parse(res);
        anime_not(response);
        setTimeout(checkUserID, 1000);
    })

    ajax('/stars', function (res) {
        var response = JSON.parse(res);
        link_estrella(response);
    })
}


function checkUserID() {
    if (userID != '') {
        getFavorites();
    } else {
        setTimeout(checkUserID, 1000);
    }
}


load_main();


