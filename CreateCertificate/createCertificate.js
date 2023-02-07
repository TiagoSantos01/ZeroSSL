const core = require('@actions/core');
const FormData = require('form-data');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const apikey_zerossl = core.getInput('apikey-zerossl');
const ssl_dns = core.getInput('ssl-dns');
const ssl_csr = core.getInput('ssl-csr');
const ssl_validaty_days = core.getInput('ssl-validaty-days');
const ssl_strict_domains = core.getInput('ssl-strict-domains');

const DNS = 'https://api.zerossl.com/certificates';

const body = new FormData();
body.append("certificate_domains", ssl_dns)
body.append("certificate_csr", ssl_csr)
body.append("certificate_validity_days", ssl_validaty_days)
body.append("strict_domains", ssl_strict_domains)

fetch(`${DNS}?access_key=${apikey_zerossl}`, {
        method: 'POST',
        body: body
    })
    .then(Response => Response.json().then(Result => {
        try {
            console.log(Result)
            const validation = Result.validation;
            if (el.commom_name == ssl_dns) {
                core.setOutput('id', Result.id);
                core.setOutput('email_validation', JSON.stringify(Result.email_validation[ssl_dns]));

                core.setOutput('file_validation_url_http', validation[ssl_dns].file_validation_url_http);
                core.setOutput('file_validation_url_https', validation[ssl_dns].file_validation_url_https);
                core.setOutput('file_validation_content', validation[ssl_dns].file_validation_content);

                core.setOutput('cname_validation_p1', validation[ssl_dns].cname_validation_p1);
                core.setOutput('cname_validation_p2', validation[ssl_dns].cname_validation_p2);

                core.setOutput('cname_validation_ttl', '3600');

            }
        } catch (e) {
            core.setFailed(e.message);
        }

    }).catch(e => core.setFailed("To transform response into json")))
    .catch(e => core.setFailed("Failed when trying to request certificate verification"))