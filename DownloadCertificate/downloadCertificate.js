const core = require('@actions/core');
const FormData = require('form-data');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_id = core.getInput('ssl-id');
const ssl_path = core.getInput('ssl-path');

const DNS = 'https://api.zerossl.com/certificates';

console.log(`${DNS}/${ssl_id}/download/return?access_key=${apikey_zerossl}`)

fetch(`${DNS}/${ssl_id}/download/return?access_key=${apikey_zerossl}`, {
        method: 'GET'
    })
    .then(Response => Response.json().then(Result => {
        try {
            var fs = require('fs');
            fs.createWriteStream(`${ssl_path}/certificate.crt`, Result['certificate.crt'], function(err) {
                if (err) throw err;
                console.log('Saved!');
            });
            fs.createWriteStream(`${ssl_path}/certificate2.crt`, Result['ca_bundle.crt'], function(err) {
                if (err) throw err;
                console.log('Saved!');
            });
        } catch (e) {
            core.setFailed(e.message);
        }
    }).catch(e => core.setFailed("To transform response into json")))
    .catch(e => core.setFailed("Failed when trying to request certificate verification"))