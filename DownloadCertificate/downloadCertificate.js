const core = require('@actions/core');

const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_id = core.getInput('ssl-id');
const ssl_path = core.getInput('ssl-path');

const DNS = 'api.zerossl.com/certificates';



fetch(`${DNS}/${ssl_id}/download/return?access_key=${apikey_zerossl}`, {
        method: 'GET'
    })
    .then(Response => Response.json().then(Result => {
        try {
            var fs = require('fs');
            fs.appendFile(`${ssl_path}/certificate.crt`, Result['certificate.crt'], function(err) {
                if (err) throw err;
                console.log('Saved!');
            });
            fs.appendFile(`${ssl_path}/certificate.crt`, Result['ca_bundle.crt'], function(err) {
                if (err) throw err;
                console.log('Saved!');
            });
        } catch (e) {
            core.setFailed(Result.error);
        }
    }).catch(e => core.setFailed("To transform response into json")))
    .catch(e => core.setFailed("Failed when trying to request certificate verification"))