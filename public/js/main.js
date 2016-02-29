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



function load_main() {
    ajax('/animes', function (res) {
        var response = JSON.parse(res);
        anime_not(response);
    })

    ajax('/stars', function (res) {
        var response = JSON.parse(res);
        link_estrella(response);
    })
}
load_main();


