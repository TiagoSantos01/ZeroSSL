const core = require('@actions/core');
const FormData = require('form-data');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_csr = core.getInput('ssl-csr');

const DNS = 'https://api.zerossl.com/validation';

let formData = new FormData()
formData.append("csr", ssl_csr)

fetch(`${DNS}/csr?access_key=${apikey_zerossl}`, {
        method: 'POST',
        body: formData
    })
    .then(Response => Response.json().then(Result => {
            core.info(JSON.stringify(Result))

            core.setOutput("valid", Result.valid)
            if (!Result.valid)
                core.error("CSR invalid")
        }).catch(e => core.setFailed("To transform response into json"))
        .catch(e => core.setFailed("Error request valid CSR")))