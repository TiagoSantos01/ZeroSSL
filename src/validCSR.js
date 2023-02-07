const core = require('@actions/core');

const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_csr = core.getInput('ssl-csr');

const DNS = 'api.zerossl.com/validation';

formData = new FormData;
formData.append("csr", ssl_csr)

fetch(`${DNS}/csr?access_key=${apikey_zerossl}`, {
        method: 'POST',
        body: formData
    })
    .then(Response => Response.json().then(Result => {
        if (ResultCertificate.valid)
            console.info("Successfully valid CSR")
        else
            throw new Error("CSR invalid")
    }).catch(Resulterror => { throw new Error("Error", Resulterror); }))
    .catch(error => { throw new Error("Error request valid CSR", error); })