const core = require('@actions/core');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_csr = core.getInput('ssl-csr');

const DNS = 'https://api.zerossl.com/validation';

let formData = new FormData()
formData.set("csr", ssl_csr)

fetch(`${DNS}/csr?access_key=${apikey_zerossl}`, {
        method: 'POST',
        body: FormData
    })
    .then(Response => Response.json().then(Result => {
            core.setOutput("valid", ResultCertificate.valid)
            if (!ResultCertificate.valid)
                core.error("CSR invalid")
        }).catch(e => core.setFailed("To transform response into json"))
        .catch(e => core.setFailed("Error request valid CSR")))