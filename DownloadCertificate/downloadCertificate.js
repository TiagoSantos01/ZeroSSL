const core = require('@actions/core');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_id = core.getInput('ssl-id');
const ssl_path = core.getInput('ssl-path');

const DNS = 'https://api.zerossl.com/certificates';

fetch(`${DNS}/${ssl_id}/download/return?access_key=${apikey_zerossl}`, {
        method: 'GET'
    })
    .then(Response => Response.json().then(Result => {
        try {
            var fs = require('fs');
            if (!fs.existsSync(ssl_path))
                fs.mkdir(`${ssl_path}`, 0722, (err) => {
                    core.info(`directory created successfully ( ${ssl_path} )`);
                })
            const certificate = `${ssl_path}/certificate.crt`;
            const ca_bundle = `${ssl_path}/ca_bundle.crt`
            fs.unlink(certificate)
            fs.unlink(ca_bundle)

            fs.writeFile(certificate, Result['certificate.crt'], function(err) {
                if (err) throw err;
                console.log('certificate.crt successfully downloaded!');
                core.setOutput('certificate', `${certificate}`)

            });
            fs.writeFile(ca_bundle, Result['ca_bundle.crt'], function(err) {
                if (err) throw err;
                console.log('ca_bundle.crt successfully downloaded!');
                core.setOutput('ca_bundle', `${ca_bundle}`)
            });
        } catch (e) {
            core.setFailed(e.message);
        }
    }).catch(e => core.setFailed("To transform response into json")))
    .catch(e => core.setFailed("Failed when trying to request certificate verification"))