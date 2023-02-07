const core = require('@actions/core');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const apikey_zerossl = core.getInput('apikey-zerossl');
const certificate_status = core.getInput('ssl-certificate-status');
const ssl_dns = core.getInput('ssl-dns');

const DNS = 'https://api.zerossl.com/certificates';
fetch(`${DNS}?access_key=${apikey_zerossl}&certificate_status=${certificate_status}`, {
        method: 'GET'
    })
    .then(Response => Response.json().then(Result => {
        try {
            Result.results.forEach(el => {
                if (el['common_name'] == ssl_dns) {
                    core.setOutput('id', el.id);
                    core.setOutput('json', JSON.stringify(el));
                }
            });
        } catch (e) {
            core.setFailed(e.message);
        }

    }).catch(e => core.setFailed("To transform response into json")))
    .catch(e => core.setFailed("Failed when trying to request certificate verification"))