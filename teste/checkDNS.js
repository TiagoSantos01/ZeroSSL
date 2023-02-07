const core = require('@actions/core');
const FormData = require('form-data');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_id = core.get('ssl-id');
const validation_method = core.get('validation_method');
const validation_email = core.get('validation_email');

const DNS = 'api.zerossl.com/certificates';

const formData = new FormData;
formData.append("validation_method", validation_method);
formData.append("validation_email", validation_email);

let retry = 0;

const CheckDNS = () => {
    fetch(`${DNS}/${ssl_id}/challenges?access_key=${apikey_zerossl}`, {
            method: 'POST',
            body: body
        })
        .then(Response => Response.json().then(Result => {
            if (retry >= 10)
                throw new Error("Fail valid DNS");

            if (Result.id == null) {
                setInterval(CheckDNS(), 5 * 1000);
                retry++;
            } else
                console.log("Dns Valid")
        }).catch(Resulterror => { throw new Error("Error", Resulterror); }))
        .catch(error => { throw new Error("Error request get certificates", error); })
}

CheckDNS()