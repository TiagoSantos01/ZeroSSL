const core = require('@actions/core');
const fs = require('fs');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const apikey_zerossl = core.getInput('apikey_zerossl');
const ssl_id = core.getInput('ssl_id');
const ssl_path = core.getInput('ssl_path');

const DNS = 'https://api.zerossl.com/certificates';

fetch(`${DNS}/${ssl_id}/download/return?access_key=${apikey_zerossl}`, {
        method: 'GET'
    })
    .then(Response => Response.json().then(Result => {
        try {
            if (!fs.existsSync(ssl_path))
                fs.mkdir(`${ssl_path}`, 0722, (err) => {
                    core.info(`directory created successfully ( ${ssl_path} )`);
                })
            const certificate = `${ssl_path}/certificate.crt`;
            const ca_bundle = `${ssl_path}/ca_bundle.crt`;
            const private_csr = `${ssl_path}/private.key`;

            if (fs.existsSync(certificate))
                fs.unlink(certificate, (err) => { if (!err) core.info(`${certificate} was deleted`) })
            if (fs.existsSync(ca_bundle))
                fs.unlink(ca_bundle, (err) => { if (!err) core.info(`${ca_bundle} was deleted`) })
            if (fs.existsSync(private_csr))
                fs.unlink(private_csr, (err) => { if (!err) core.info(`${private_csr} was deleted`) })

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

            fs.writeFile(private_csr, core.getInput('ssl_csr_priv'), function(err) {
                if (err) throw err;
                console.log('private.key successfully downloaded!');
            });
        } catch (e) {
            core.setFailed(e.message);
        }
    }).catch(e => core.setFailed("To transform response into json")))
    .catch(e => core.setFailed("Failed when trying to request certificate verification"))