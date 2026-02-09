const {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  getExampleNumber,
} = require("libphonenumber-js");
const metadata = require("libphonenumber-js/metadata.full.json");
const examples = require("libphonenumber-js/examples.mobile.json");

const DEFAULT_COUNTRY = "GB";

function digitsOnly(value = "") {
  return value.replace(/[^0-9]/g, "");
}

function getExample(countryCode) {
  const example = getExampleNumber(countryCode, examples, metadata);
  return example ? example.formatNational() : "";
}

function normalizePhoneNumber(rawValue, countryCode = DEFAULT_COUNTRY) {
  const code = String(countryCode || DEFAULT_COUNTRY).toUpperCase();
  const trimmed = String(rawValue || "").trim();

  if (!trimmed) {
    return { e164: null, error: "Missing phone number" };
  }

  let prepared = trimmed.replace(/[\s()-]/g, "");
  if (prepared.startsWith("00")) {
    prepared = `+${prepared.slice(2)}`;
  }

  if (!prepared.startsWith("+")) {
    if (prepared.startsWith("0") && code === "GB") {
      prepared = `+44${prepared.slice(1)}`;
    } else {
      const dial = getCountryCallingCode(code, metadata);
      if (!dial) {
        return { e164: null, error: "Unknown country code" };
      }
      prepared = `+${dial}${prepared.replace(/^0+/, "")}`;
    }
  }

  const parsedWithCountry = parsePhoneNumberFromString(prepared, code, metadata);
  const parsed = parsedWithCountry || parsePhoneNumberFromString(prepared, undefined, metadata);

  if (!parsed || !parsed.isValid()) {
    const hint = getExample(code);
    const help = hint ? ` Please use a mobile format like ${hint}.` : "";
    return { e164: null, error: `Invalid phone number.${help}` };
  }

  const normalizedDigits = digitsOnly(parsed.number);
  if (normalizedDigits.length < 8 || normalizedDigits.length > 15) {
    return { e164: null, error: "Phone number length looks invalid." };
  }

  return { e164: parsed.number, country: { code: parsed.country || code } };
}

module.exports = { DEFAULT_COUNTRY, normalizePhoneNumber };
