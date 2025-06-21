import fs from 'fs';
import * as csv from 'fast-csv';
import log from './log.ts';
import { basename } from 'path';
import { convertDEC, convertRA, matchSources, repartIdentifiers } from './astroUtils.ts';

type DSORow_unprocessed = {
  name: string; // Object name composed by catalog + number, e.g., NGC for New General Catalogue, IC for Index Catalogue
  type: //Object type
  | "*" //Star
    | "**" //Double star
    | "*Ass" //Association of stars
    | "OCl" //Open Cluster
    | "GCl" //Globular Cluster
    | "Cl+N" //Star cluster + Nebula
    | "G" //Galaxy
    | "GPair" //Galaxy pair
    | "GTrpl" //Galaxy triplet
    | "GGroup" //Galaxy group
    | "PN" //Planetary nebula
    | "HII" //HII Ionized region
    | "DrkN" //Dark nebula
    | "EmN" //Emission nebula
    | "Neb" //Nebula
    | "RfN" //Reflection nebula
    | "SNR" //Supernova remnant
    | "Nova" //Nova star
    | "NonEx" //Non-existent object
    | "Dup" //Duplicate object (see NGC or IC columns to find the master object)
    | "Other"; //Other classification (see object notes)
  right_ascension: string; //Right Ascension in J2000 Epoch (HH:MM:SS.SS)
  declination: string; //Declination in J2000 Epoch (+/-DD:MM:SS.SS)
  constellation: string; //Constellation where the object is located
  //Serpens is expressed as 'Se1' for Serpens Caput and 'Se2' for Serpens Caudi
  major_axis: string; //Major axis, expressed in arcmin
  minor_axis: string; //Minor axis, expressed in arcmin
  position_angle: string; //Major axis position angle (North Eastwards)
  b_magnitude: string; //Apparent total magnitude in B filter
  v_magnitude: string; //Apparent total magnitude in V filter
  j_magnitude: string; //Apparent total magnitude in J filter
  h_magnitude: string; //Apparent total magnitude in H filter
  k_magnitude: string; //Apparent total magnitude in K filter
  surface_brightness: string; //(only for galaxies) Mean surface brigthness within 25 mag isophot (B-band), expressed in mag/arcsec2
  hubble_morphological_type: string; //(only for galaxies) Morphological type (for galaxies)
  parallax: string; //Parallax, expressed in milliarcseconds
  proper_motion_ra: string; //Proper motion in RA, expressed in milliarcseconds/year
  proper_motion_dec: string; //Proper motion in Dec, expressed in milliarcseconds/year
  radial_velocity: string; //Radial velocity (heliocentric), expressed in km/s
  redshift: string; //Redshift (heliocentric)
  central_star_u_mag: string; //(only Planetary Nebulae): Apparent magnitude of central star in U filter
  central_star_b_mag: string; //(only Planetary Nebulae): Apparent magnitude of central star in B filter
  central_star_v_mag: string; //(only Planetary Nebulae): Apparent magnitude of central star in V filter
  messier: string; //cross reference Messier number
  ngc: string; //other NGC identification, if the object is listed twice in the catalog
  ic: string; //cross reference IC number, if the object is also listed with that identification
  central_star_names: string; //(only Planetary Nebulae): central star identifications
  identifiers: string; //cross reference with other catalogs
  common_names: string; //Common names of the object if any
  ned_notes: string; //notes about object exported from NED
  openngc_notes: string; //notes about the object data from OpenNGC catalog
  sources: string; //sources of data
  /*
    1: NASA Extragalactic Database
    2: SIMBAD Astronomical Database
    3: HyperLeda
    4: Harold Corwin's NGC/IC Positions and Notes
    5: HEASARC mwsc table
    6: HEASARC smcclustrs table
    7: HEASARC lmcextobj table
    8: HEASARC plnebulae table
    9: HEASARC lbn table
    10: HEASARC messier table
    11: HEASARC lyngaclust table
    99: OpenNGC revised data
  */
};

type DSORow_processed = {
  type: //Object type
  | "*" //Star
    | "**" //Double star
    | "*Ass" //Association of stars
    | "OCl" //Open Cluster
    | "GCl" //Globular Cluster
    | "Cl+N" //Star cluster + Nebula
    | "G" //Galaxy
    | "GPair" //Galaxy pair
    | "GTrpl" //Galaxy triplet
    | "GGroup" //Galaxy group
    | "PN" //Planetary nebula
    | "HII" //HII Ionized region
    | "DrkN" //Dark nebula
    | "EmN" //Emission nebula
    | "Neb" //Nebula
    | "RfN" //Reflection nebula
    | "SNR" //Supernova remnant
    | "Nova" //Nova star
    | "NonEx" //Non-existent object
    | "Dup" //Duplicate object (see NGC or IC columns to find the master object)
    | "Other"; //Other classification (see object notes)
  right_ascension: number; //Right Ascension in J2000 Epoch (HH:MM:SS.SS)
  declination: number; //Declination in J2000 Epoch (+/-DD:MM:SS.SS)
  constellation: string; //Constellation where the object is located
  //Serpens is expressed as 'Se1' for Serpens Caput and 'Se2' for Serpens Caudi
  major_axis: number; //Major axis, expressed in arcmin
  minor_axis: number; //Minor axis, expressed in arcmin
  position_angle: number; //Major axis position angle (North Eastwards)
  b_magnitude: number; //Apparent total magnitude in B filter
  v_magnitude: number; //Apparent total magnitude in V filter
  j_magnitude: number; //Apparent total magnitude in J filter
  h_magnitude: number; //Apparent total magnitude in H filter
  k_magnitude: number; //Apparent total magnitude in K filter
  surface_brightness: number; //(only for galaxies) Mean surface brigthness within 25 mag isophot (B-band), expressed in mag/arcsec2
  hubble_morphological_type: string; //(only for galaxies) Morphological type (for galaxies)
  parallax: number; //Parallax, expressed in milliarcseconds
  proper_motion_ra: number; //Proper motion in RA, expressed in milliarcseconds/year
  proper_motion_dec: number; //Proper motion in Dec, expressed in milliarcseconds/year
  radial_velocity: number; //Radial velocity (heliocentric), expressed in km/s
  redshift: number; //Redshift (heliocentric)
  central_star_u_mag: number; //(only Planetary Nebulae): Apparent magnitude of central star in U filter
  central_star_b_mag: number; //(only Planetary Nebulae): Apparent magnitude of central star in B filter
  central_star_v_mag: number; //(only Planetary Nebulae): Apparent magnitude of central star in V filter
  messier: number[]; //cross reference Messier number
  ngc: number[]; //other NGC identification, if the object is listed twice in the catalog
  ic: number[]; //cross reference IC number, if the object is also listed with that identification
  central_star_names: string[]; //(only Planetary Nebulae): central star identifications
  identifiers: string[]; //cross reference with other catalogs
  keywords: string[]; //keywords to help search algorithm
  common_names: { en: string[]; fr: string[] }; //common names in English and French if available
  ned_notes: string; //notes about object exported from NED
  openngc_notes: string; //notes about the object data from OpenNGC catalog
  sources: { [key: string]: number }; //sources of data
  /*
    1: NASA Extragalactic Database
    2: SIMBAD Astronomical Database
    3: HyperLeda
    4: Harold Corwin's NGC/IC Positions and Notes
    5: HEASARC mwsc table
    6: HEASARC smcclustrs table
    7: HEASARC lmcextobj table
    8: HEASARC plnebulae table
    9: HEASARC lbn table
    10: HEASARC messier table
    11: HEASARC lyngaclust table
    99: OpenNGC revised data
  */
};

const headers: string[] = [
  "name",
  "type",
  "right_ascension",
  "declination",
  "constellation",
  "major_axis",
  "minor_axis",
  "position_angle",
  "b_magnitude",
  "v_magnitude",
  "j_magnitude",
  "h_magnitude",
  "k_magnitude",
  "surface_brightness",
  "hubble_morphological_type",
  "parallax",
  "proper_motion_ra",
  "proper_motion_dec",
  "radial_velocity",
  "redshift",
  "central_star_u_mag",
  "central_star_b_mag",
  "central_star_v_mag",
  "messier",
  "ngc",
  "ic",
  "central_star_names",
  "identifiers",
  "common_names",
  "ned_notes",
  "openngc_notes",
  "sources",
];

export function countLines(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let count = 0;
    let leftover = '';

    stream.on('data', (chunk: string) => {
      let i = 0;
      let start = 0;

      while ((i = chunk.indexOf('\n', start)) !== -1) {
        count++;
        start = i + 1;
      }

      leftover = chunk.slice(start);
    });

    stream.on('end', () => {
      if (leftover.length > 0) count++; // last line without \n
      resolve(count);
    });

    stream.on('error', reject);
  });
}

export function parseDSOCSV(filePath: string): Promise<DSORow_unprocessed[]> {
  return new Promise(async (resolve, reject) => {
    log.play("CSV parser", `Parsing ${basename(filePath)} file...`)
    const spinner = log.progress.init("CSV parser", "Counting file rows...")
    const csvTotalRows: number = await countLines(filePath) - 1; //remove header
    var rowNumber = 0;

    var csvData: DSORow_unprocessed[] = [];

    const stream = csv.parse({ headers, renameHeaders: true, delimiter: ";" })
    .transform((row: DSORow_unprocessed): DSORow_processed => {
      const newMessier = row.messier == "" ? [] : row.messier.split(",").map((item: string) => parseInt(item.replace("M", "")));
      const newNGC = row.ngc == "" ? [] : row.ngc.split(",").map((item: string) => parseInt(item.replace("NGC", "")));
      const newIC = row.ic == "" ? [] : row.ic.split(",").map((item: string) => parseInt(item.replace("IC", "")));
      const newIdentifiers = row.identifiers == "" ? [] : row.identifiers.split(",");
      const newCommonNames = row.common_names == "" ? [] : row.common_names.split(",");

      const repartedIndentifiers = repartIdentifiers(row.name, newMessier, newNGC, newIC, newIdentifiers, newCommonNames);

      //Identifiers
      return {
        type: row.type,
        right_ascension: convertRA(row.right_ascension),
        declination: convertDEC(row.declination),
        constellation: row.constellation == "" ? "NONE" : row.constellation.replace("Se1", "Ser").replace("Se2", "Ser"), //Replace Se1 and Se2 with Ser (Serpens constellation)
        major_axis: parseFloat(row.major_axis),
        minor_axis: parseFloat(row.minor_axis),
        position_angle: parseFloat(row.position_angle),
        b_magnitude: parseFloat(row.b_magnitude),
        v_magnitude: parseFloat(row.v_magnitude),
        j_magnitude: parseFloat(row.j_magnitude),
        h_magnitude: parseFloat(row.h_magnitude),
        k_magnitude: parseFloat(row.k_magnitude),
        surface_brightness: parseFloat(row.surface_brightness),
        hubble_morphological_type: row.hubble_morphological_type,
        parallax: parseFloat(row.parallax),
        proper_motion_ra: parseFloat(row.proper_motion_ra),
        proper_motion_dec: parseFloat(row.proper_motion_dec),
        radial_velocity: parseFloat(row.radial_velocity),
        redshift: parseFloat(row.redshift),
        central_star_u_mag: parseFloat(row.central_star_u_mag),
        central_star_b_mag: parseFloat(row.central_star_b_mag),
        central_star_v_mag: parseFloat(row.central_star_v_mag),
        messier: repartedIndentifiers.messier,
        ngc: repartedIndentifiers.ngc,
        ic: repartedIndentifiers.ic,
        central_star_names: row.central_star_names == "" ? [] : row.central_star_names.split(","),
        identifiers: repartedIndentifiers.identifiers,
        keywords: repartedIndentifiers.keywords,
        common_names: repartedIndentifiers.common_names,
        ned_notes: row.ned_notes,
        openngc_notes: row.openngc_notes,
        sources: matchSources(row.sources.split("|"))
      }
    })
    .on('error', (error) => {
      log.progress.fail(spinner, "CSV parser", "Task failed")
      reject(error);
    })
    .on('data', (row: DSORow_unprocessed) => {
      csvData.push(row)
      rowNumber++;

      /* console.log(row) */

      log.progress.update(spinner, "CSV parser", `Parsed rows : ${rowNumber}/${csvTotalRows} (${Math.floor((rowNumber/csvTotalRows) * 100)})`);
    })
    .on('end', (rowCount: number) => {
      log.progress.succeed(spinner, "CSV parser", `Parsed ${rowCount} entries sucessfully !`);
      resolve(csvData);
    });

    fs.createReadStream(filePath, "utf8").pipe(stream)
  })
}