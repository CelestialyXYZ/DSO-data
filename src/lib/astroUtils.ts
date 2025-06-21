import { uniq, deburr } from "lodash-es";
import { readFileSync } from "fs";

/**
 * Converts a Right Ascension (RA) given in H:M:S format to a decimal value in hours.
 * @param {string} text - The Right Ascension (RA) given in H:M:S format.
 * @returns {number} - The Right Ascension (RA) in decimal hours.
 */
export function convertRA(text: string) {
  const [hours, minutes, seconds] = text.split(":");
  return Number(hours) + Number(minutes) / 60 + Number(seconds) / 3600;
}

/**
 * Converts a Declination (DEC) given in D:M:S format to a decimal value in degrees.
 * @param {string} text - The Declination (DEC) given in D:M:S format, optionally prefixed with '+' or '-'.
 * @returns {number} - The Declination (DEC) in decimal degrees.
 */
export function convertDEC(text: string) {
  const isMinus = text.startsWith("-");
  const [degrees, minutes, seconds] = text
    .replace("-", "")
    .replace("+", "")
    .split(":");
  return isMinus
    ? -1 * (Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600)
    : Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600;
}

export function getMessierCommonNames(messier_id: number): {
  messier_id: number;
  names: { en: string[]; fr: string[] };
} {
  const messier_locales = JSON.parse(
    readFileSync("src/assets/messier_locales.json", "utf-8")
  );
  let data = { messier_id: null, names: { en: [], fr: [] } };

  if (
    messier_locales.findIndex((item: any) => item.messier_id == messier_id) ==
    -1
  ) {
    data = { messier_id: null, names: { en: [], fr: [] } };
  } else {
    data = messier_locales.find((item: any) => item.messier_id == messier_id);
  }

  return data;
}

/**
 * Repart the identifiers of a Deep Sky Object (DSO) between Messier, NGC, IC, identifiers and keywords.
 * @param {string} name - The name of the DSO.
 * @param {number[]} messier - The Messier identifiers of the DSO.
 * @param {number[]} ngc - The NGC identifiers of the DSO.
 * @param {number[]} ic - The IC identifiers of the DSO.
 * @param {string[]} identifiers - The other identifiers of the DSO.
 * @param {string[]} common_names - The common names of the DSO.
 * @returns {Object} - The reparted identifiers with a name, Messier identifiers, NGC identifiers, IC identifiers, other identifiers, keywords and common names.
 */
export function repartIdentifiers(
  name: string,
  messier: number[],
  ngc: number[],
  ic: number[],
  identifiers: string[],
  common_names: string[]
): {
  messier: number[];
  ngc: number[];
  ic: number[];
  identifiers: string[];
  keywords: string[];
  common_names: { en: string[]; fr: string[] };
} {
  const identifier = detectIdentifier(messier.length > 0 ? `M${messier[0]}` : name); //Pass messier if exists or name that only contains NGC/IC
  const identifier_without_messier = detectIdentifier(name);

  //Get messier common name.
  let messierCommonNames: {
    messier_id: number;
    names: { en: string[]; fr: string[] };
  } = { messier_id: null, names: { en: [], fr: [] } };
  if (identifier.type == "M") {
    messierCommonNames = getMessierCommonNames(identifier.number);
  }

  const result = {
    messier: [
      ...messier,
      ...(identifier.type == "M" && !messier.includes(identifier.number)
        ? [identifier.number]
        : [])
    ],
    ngc: [
      ...ngc,
      ...(identifier.type == "NGC" && !ngc.includes(identifier.number)
        ? [identifier.number]
        : []),
      ...(identifier_without_messier.type == "NGC" && !ngc.includes(identifier_without_messier.number) && identifier_without_messier.name != identifier.name)
        ? [identifier_without_messier.number]
        : [], //Add lost identifier because if there's a messier id, it will override ngc/ic/other name
    ],
    ic: [
      ...ic,
      ...(identifier.type == "IC" && !ic.includes(identifier.number)
        ? [identifier.number]
        : []),
      ...(identifier_without_messier.type == "IC" && !ic.includes(identifier_without_messier.number) && identifier_without_messier.name != identifier.name)
        ? [identifier_without_messier.number]
        : [], //Add lost identifier because if there's a messier id, it will override ngc/ic/other name
    ],
    identifiers: [
      ...identifiers.filter(
        (item: string) =>
          item.replaceAll(" ", "") != identifier.name.replaceAll(" ", "")
      ),
      ...(identifier.type == "Other" ? [identifier.name] : []),
      ...(identifier_without_messier.type == "Other" && identifier_without_messier.name != identifier.name)
        ? [identifier_without_messier.name]
        : [], //Add lost identifier because if there's a messier id, it will override ngc/ic/other name
    ],
    keywords: [],
    common_names: {
      en: uniq([
        ...(identifier.type == "M" ? messierCommonNames.names.en : []),
        ...common_names,
      ]),
      fr: uniq([
        ...(identifier.type == "M" ? messierCommonNames.names.fr : []),
      ]),
    },
  };

  //Keep only unique keywords and remove non-alphanumeric caracters / also remove accents and deburring strings using lodash and deburr
  result.keywords = uniq(
    [
      ...result.messier.map((item: number) => `m${item}`),
      ...result.ngc.map((item: number) => `ngc${item}`),
      ...result.ic.map((item: number) => `ic${item}`),
      ...result.identifiers,
      ...result.common_names.en,
      ...result.common_names.fr,
    ].map((item: string) => deburr(item.toLowerCase()).replaceAll(/[^a-zA-Z0-9]/g, ""))
  );

  return result;
}

/**
 * Detects if the given identifier is a Messier, NGC, IC or other identifier.
 * @param {string} identifier - The identifier to detect.
 * @returns {Object} - An object with the name, number and type of the identifier.
 * The type can be "NGC", "IC", "M" or "Other". The number is null if the type is "Other".
 */
export function detectIdentifier(identifier: string): {
  name: string;
  number: number | null;
  type: "NGC" | "IC" | "M" | "Other";
} {
  if (identifier.startsWith("NGC")) {
    return {
      name: "NGC " + parseInt(identifier.replace("NGC", "")),
      number: parseInt(identifier.replace("NGC", "")),
      type: "NGC",
    };
  } else if (identifier.startsWith("IC")) {
    return {
      name: "IC " + parseInt(identifier.replace("IC", "")),
      number: parseInt(identifier.replace("IC", "")),
      type: "IC",
    };
  } else if (identifier.startsWith("M")) {
    return {
      name: "M " + parseInt(identifier.replace("M", "")),
      number: parseInt(identifier.replace("M", "")),
      type: "M",
    };
  } else {
    console.error(`Unknown identifier: ${identifier}`);
    return {
      name: identifier,
      number: null,
      type: "Other",
    };
  }
}

const labels_rename = {
  Name: "name",
  Type: "type",
  RA: "right_ascension",
  Dec: "declination",
  Const: "constellation",
  MajAx: "major_axis",
  MinAx: "minor_axis",
  PosAng: "position_angle",
  "B-Mag": "b_magnitude",
  "V-Mag": "v_magnitude",
  "J-Mag": "j_magnitude",
  "H-Mag": "h_magnitude",
  "K-Mag": "k_magnitude",
  SurfBr: "surface_brightness",
  Hubble: "hubble_morphological_type",
  Pax: "parallax",
  "Pm-RA": "proper_motion_ra",
  "Pm-Dec": "proper_motion_dec",
  RadVel: "radial_velocity",
  Redshift: "redshift",
  "Cstar U-Mag": "central_star_u_mag",
  "Cstar B-Mag": "central_star_b_mag",
  "Cstar V-Mag": "central_star_v_mag",
  M: "messier",
  NGC: "ngc",
  IC: "ic",
  "Cstar Names": "central_star_names",
  Identifiers: "identifiers",
  "Common Names": "common_names",
  "NED Notes": "ned_notes",
  "OpenNGC Notes": "openngc_notes",
};

/**
 * Matches a label from the CSV file to its corresponding label in the internal database.
 * @param {string} label - The label to match.
 * @returns {string | null} - The matched label, or null if no match is found.
 */
export function matchLabel(label: string): string | null {
  return labels_rename[label] || null;
}

/**
 * Matches and converts a list of source strings to an object mapping internal labels to their numeric values.
 * Each source string is expected to be in the format "label:value", where label corresponds to an entry in
 * the internal labels mapping and value is a numeric string.
 *
 * @param {string[]} sources - An array of source strings to be matched and converted.
 * @returns {{ [key: string]: number }} - An object where keys are the matched internal labels and values are the parsed integers from the source strings.
 */
export function matchSources(sources: string[]): { [key: string]: number } {
  const result: { [key: string]: number } = {};
  for (const source of sources) {
    const data = source.split(":");
    const label = matchLabel(data[0]);

    if (label) {
      result[label] = parseInt(data[1]);
    }
  }
  return result;
}
