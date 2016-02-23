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



ajax('/animes', function (res) {
    var response = JSON.parse(res);
    response.forEach(function (el) {
        anime_not({
            image: el.image,
            text: el.anime.split('-').join(' ') + ' ' + el.episode,
            link: '/' + el.anime + '/' + el.episode
        });
    });
})

ajax('/stars', function (res) {
    var response = JSON.parse(res);
    response.forEach(function (el) {
        link_estrella({
            text: el.text,
            link: el.link
        });
    });
})
