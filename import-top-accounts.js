var start = new Date().getTime();

var importTopAccounts = function() {

    //Load packages
    var fs = require('fs');
    var request = require('sync-request');
    var cheerio = require("cheerio");

    // Reads text file with URL, gets rid of invisible characters, and converts to array
    var urlArray = (fs.readFileSync('url-array', 'utf8')).replace(/\r?\n|\r/g, '').split(',');

    // Array containing all account info
    var topAccountsArray = [];

    // Run scraper for each url

    urlArray.forEach(function(url) {

        var parseHtml = function(html) {
            $ = cheerio.load(html)

            var accounts = [];

            // Grab account values
            $('#username a').each(function(i, elem) {
                accounts[i] = { account: $(this).text() };
            });

            // Grab account id
            var idCounter = 0;
            accounts.forEach(function(account) {

                try {
                    var res = request('GET', 'https://www.instagram.com/' + (account.account).toString() + '/?__a=1');
                    var id = parseInt(JSON.parse(res.getBody().toString()).user.id);
                    accounts[idCounter].id = (!isNaN(id)) ? id : null;
                    idCounter++;

                } catch (e) {
                    accounts[idCounter].id = null;
                    idCounter++;
                }

            })

            // Grab follower values
            var followersCounter = 0;
            $('td').each(function(i, elem) {
                var text = $(this).text();
                if (text.includes('Followers')) {
                    var value = parseInt(text.replace('Followers', '').replace(/,/g, ''))
                    if (!isNaN(value)) {
                        accounts[followersCounter].followers = value;
                        followersCounter++;
                    }

                }
            });

            // Grab media values
            var mediaCounter = 0;
            $('td').each(function(i, elem) {
                var text = $(this).text();
                if (text.includes('Media')) {
                    var value = parseInt(text.replace('Media', '').replace(/,/g, ''))
                    if (!isNaN(value)) {
                        accounts[mediaCounter].media = value;
                        mediaCounter++;
                    }

                }
            });

            accounts.join(', ');
            topAccountsArray = topAccountsArray.concat(accounts);
        };

        var res = request('GET', url);
        parseHtml(res.getBody());


    })

    // Write full array of top accounts to file   
    fs.writeFile("./top-accounts-array", JSON.stringify(topAccountsArray));

}

importTopAccounts();


var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time);


