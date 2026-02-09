import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import metadata from "libphonenumber-js/metadata.full.json";

const regionNames =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : { of: (code) => code };

const DEFAULT_COUNTRY = "GB";
const POPULAR_COUNTRY_CODES = ["GB", "US", "CA", "AU", "IE", "IN"];

const BASIC_FALLBACK_COUNTRIES = [
  { code: "GB", name: "United Kingdom", dialCode: "+44", example: "07700 900123" },
  { code: "US", name: "United States", dialCode: "+1", example: "(201) 555-0123" },
  { code: "CA", name: "Canada", dialCode: "+1", example: "(204) 234-5678" },
  { code: "AU", name: "Australia", dialCode: "+61", example: "0401 234 567" },
  { code: "IE", name: "Ireland", dialCode: "+353", example: "085 234 5678" },
  { code: "IN", name: "India", dialCode: "+91", example: "091234 56789" },
];

function buildCountries() {
  try {
    const fullMetadata = metadata && metadata.country_calling_codes ? metadata : undefined;
    const exampleSet = examples && Object.keys(examples).length ? examples : undefined;

    const resolvedCountries = getCountries(fullMetadata)
      .map((code) => {
        const name = regionNames.of(code) || code;
        const dialCode = `+${getCountryCallingCode(code, fullMetadata)}`;
        const exampleNumber = fullMetadata
          ? getExampleNumber(code, exampleSet, fullMetadata)
          : undefined;

        return {
          code,
          name,
          dialCode,
          example: exampleNumber ? exampleNumber.formatNational() : "",
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    if (resolvedCountries.length) {
      return resolvedCountries;
    }
  } catch (err) {
    console.error("Falling back to basic country list", err);
  }

  return BASIC_FALLBACK_COUNTRIES;
}

const COUNTRIES = buildCountries();

const FALLBACK_COUNTRIES = POPULAR_COUNTRY_CODES.map((code) =>
  COUNTRIES.find((country) => country.code === code)
).filter(Boolean);

let countriesCache = FALLBACK_COUNTRIES.length ? [...FALLBACK_COUNTRIES] : [...COUNTRIES];

function getCountry(code) {
  return (
    countriesCache.find((country) => country.code === code) ||
    COUNTRIES.find((country) => country.code === code) ||
    countriesCache[0] ||
    COUNTRIES[0]
  );
}

async function loadCountries() {
  if (countriesCache.length === COUNTRIES.length) {
    return countriesCache;
  }

  countriesCache = [...COUNTRIES];
  return countriesCache;
}

function normalizePhoneNumber(rawValue, countryCode = DEFAULT_COUNTRY) {
  const trimmed = String(rawValue || "").trim();
  const selectedCountry = getCountry(countryCode);
  const friendlyName = selectedCountry.name || countryCode;

  if (!trimmed) {
    return {
      e164: "",
      error: "Please enter your mobile number so we can text you updates.",
      country: selectedCountry,
    };
  }

  let prepared = trimmed.replace(/[\s()-]/g, "");
  if (prepared.startsWith("00")) {
    prepared = `+${prepared.slice(2)}`;
  }

  if (!prepared.startsWith("+") && selectedCountry?.code === "GB" && prepared.startsWith("0")) {
    prepared = `+44${prepared.slice(1)}`;
  }

  let parsed;
  try {
    const parsedWithCountry = parsePhoneNumberFromString(
      prepared,
      selectedCountry.code,
      metadata
    );
    parsed = parsedWithCountry || parsePhoneNumberFromString(prepared, undefined, metadata);
  } catch (err) {
    console.error("Phone parsing failed", err);
    parsed = undefined;
  }

  if (!parsed) {
    return {
      e164: "",
      error: "Please enter a valid mobile number for " + friendlyName + ".",
      country: selectedCountry,
    };
  }

  if (!parsed.isValid()) {
    const exampleText = selectedCountry.example ? " (for example " + selectedCountry.example + ")" : "";
    return {
      e164: "",
      error: "Please enter a valid mobile number for " + friendlyName + exampleText + ".",
      country: selectedCountry,
    };
  }

  const parsedCountry = parsed.country || selectedCountry.code;
  return {
    e164: parsed.number,
    country: getCountry(parsedCountry),
  };
}

function formatPhoneInput(rawValue, countryCode = DEFAULT_COUNTRY) {
  const safeValue = String(rawValue ?? "");
  const sanitized = safeValue.replace(/[^\d+().\s-]/g, "");

  const formatter = new AsYouType(countryCode, metadata);
  formatter.input(sanitized);

  const formattedNumber = formatter.getFormattedNumber();
  const nationalNumber = formatter.getNationalNumber();
  const parsed = formatter.getNumber();

  return {
    formatted: formattedNumber || sanitized,
    raw: nationalNumber || sanitized.replace(/\D/g, ""),
    e164: parsed ? parsed.number : "",
  };
}

export {
  DEFAULT_COUNTRY,
  FALLBACK_COUNTRIES,
  formatPhoneInput,
  loadCountries,
  normalizePhoneNumber,
};
