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
        console.log(Result)
        Result.result.forEach(el => {
            if (el.commom_name == ssl_dns) {
                core.setOutput('check-id', el.id);
                core.setOutput('check-json', JSON.stringify(el));
            }
        });
    }).catch(Resulterror => { console.log("Error get response api", Resulterror); }))
    .catch(error => { console.log("Error request get certificates", error); })