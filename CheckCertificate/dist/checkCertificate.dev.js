"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var core = require('@actions/core');

var fetch = function fetch() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('node-fetch'));
  }).then(function (_ref) {
    var fetch = _ref["default"];
    return fetch.apply(void 0, args);
  });
};

var apikey_zerossl = core.getInput('apikey_zerossl');
var certificate_status = core.getInput('ssl_certificate_status');
var ssl_dns = core.getInput('ssl_dns');
var DNS = 'https://api.zerossl.com/certificates';
fetch("".concat(DNS, "?access_key=").concat(apikey_zerossl, "&certificate_status=").concat(certificate_status), {
  method: 'GET'
}).then(function (Response) {
  return Response.json().then(function (Result) {
    try {
      Result.results.forEach(function (el) {
        if (el['common_name'] == ssl_dns) {
          core.setOutput('id', el.id);
          core.setOutput('json', JSON.stringify(el));
        }
      });
    } catch (e) {
      core.setFailed(Result);
    }
  })["catch"](function (e) {
    return core.setFailed("To transform response into json");
  });
})["catch"](function (e) {
  return core.setFailed("Failed when trying to request certificate verification");
});