/**
 * Simple wrapper to retrieve Cloudflare's 'solved' cookie.
 * @type {Object}
 */
var cloudflareChallenge = {

    webpage: false,
    system: false,
    page: false,
    url: false,
    userAgent: false,
    timeout: 1000,

	/**
	 * Initiate object.
	 */
    init: function () {
        this.webpage = require('webpage');
        this.system = require('system');
        this.page = this.webpage.create();
        this.url = this.system.args[1];
        this.userAgent = 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0';
        this.timeout = 2000;
    },

	/**
	 * "Solve" Cloudflare's challenge using PhantomJS's engine.
	 * @return {String} JSON containing our cookies.
	 */
    solve: function () {
        var self = this;
        var url = this.url;
        this.page.settings.userAgent = this.userAgent;
        this.page.open(this.url, function (status) {
            var page = self.page;
            setTimeout(function () {
                console.log('PJS->  :: Challenge status ' + url);
                var stat = page.evaluate(function () {
                    console.log('PJS->  :: Challenge Inside the web');
                    return document.getElementById('challenge-form').length;
                });
                console.log(status + ' ' + stat);
                if (status == 'fail' || stat == 0) {
                    cloudflareChallenge.timeout += 1000;
                    cloudflareChallenge.solve();
                } else {
                    begin();
                }
            }, self.timeout);
        });
    }

}

/**
 * In order to carry on making requests, both user agent and IP address must what is returned here.
 */
console.log('PJS->  :: Initiating challenge');
cloudflareChallenge.init();
cloudflareChallenge.solve();




function begin() {
    var page = cloudflareChallenge.page;
    console.log('PJS->  :: Begin function');
    var system = require('system');
    var args = system.args;

    page.onConsoleMessage = function (msg) {
        console.log(msg);
    };


    console.log('PJS->  Url: ' + args[1]);


    page.open(args[1], function (status) {
        if (status == 'fail') {
            console.log('PJS->  status');
            console.log('fail');
            phantom.exit();
        }
        console.log('PJS->  status');
        console.log(status);
        console.log("PJS->  waiting..");
        setTimeout(function () {
            console.log('PJS->  Waiting the page load..');
            setTimeout(function () {
                var downloadUrl = page.evaluate(function () {


                    console.log('PJS->  Inside the web');
                    var animes = document.querySelectorAll('.not a');
                    var res = [];
                    for (var a in animes) {
                        try {
                            console.log(animes[a]);
                            var image = animes[a].querySelector('img');
                            image = image.getAttribute('src');
                            var imgFixed = image.split('http')[1];
                            imgFixed = 'https' + imgFixed;
                            var anime = animes[a].getAttribute('title');
                            anime = anime.split(' ');
                            var episode = anime.pop();
                            anime = anime.join('-');
                            res.push({
                                anime: anime,
                                episode: episode,
                                image: imgFixed
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return res;



                });
                console.log('RETURN:' + JSON.stringify(downloadUrl));
                phantom.exit();
            }, 5000);
        }, 2000);
    });
}


