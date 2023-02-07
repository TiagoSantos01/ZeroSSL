const core = require('@actions/core');

const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_csr = core.getInput('ssl-csr');

const DNS = 'https://api.zerossl.com/validation';

const formData = new FormData;
formData.append("csr", ssl_csr)

fetch(`${DNS}/csr?access_key=${apikey_zerossl}`, {
        method: 'POST',
        body: formData
    })
    .then(Response => Response.json().then(Result => {
            core.setOutput("valid", ResultCertificate.valid)
            if (!ResultCertificate.valid)
                core.error("CSR invalid")
        }).catch(e => core.setFailed("To transform response into json"))
        .catch(e => core.setFailed("Error request valid CSR")))