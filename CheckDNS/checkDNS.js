const core = require('@actions/core');
const FormData = require('form-data');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const apikey_zerossl = core.getInput('apikey_zerossl');
const ssl_id = core.getInput('ssl_id');
const validation_method = core.getInput('validation_method');
const validation_email = core.getInput('validation_email');

const DNS = 'https://api.zerossl.com/certificates';

const body = new FormData();
body.append("validation_method", validation_method);
body.append("validation_email", validation_email);

let retry = 0;
core.setOutput("valid", false)
const CheckDNS = () => {
    fetch(`${DNS}/${ssl_id}/challenges?access_key=${apikey_zerossl}`, {
            method: 'POST',
            body: body
        })
        .then(Response => Response.json().then(Result => {
            console.log("test")
            if (Result.error != null) {
                retry++;
                if (retry < 10)
                    setTimeout(CheckDNS, 5 * 1000);
                if (retry >= 10)
                    core.setFailed(Result.error);
            } else {
                core.info("Dns Valid");
                core.setOutput("valid", true)
            }
        }).catch(e => core.setFailed("To transform response into json")))
        .catch(e => {
            core.error(e.message);
            core.setFailed("Error request valid DNS");
        })
}

CheckDNS()