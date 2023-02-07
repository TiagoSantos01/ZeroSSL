const core = require('@actions/core');
const { exit } = require('process');
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
            Result.result.forEach(el => {
                if (el.commom_name == ssl_dns) {
                    core.setOutput('check-id', el.id);
                    core.setOutput('check-json', JSON.stringify(el));
                }
            });
        } catch (e) {
            core.setFailed(e.message);
        }

    }).catch(Resulterror => {
        core.setFailed("To transform response into json");
    }))
    .catch(error => { core.error("Error request get certificates"); throw error; })