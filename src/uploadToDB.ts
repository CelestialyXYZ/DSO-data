import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import log from './lib/log.ts'
import { readFileSync } from 'fs'

//Import DB types
import type { Database } from './supabase.ts'

//Import environment variables
dotenv.config()


const main = async () => {
    log.info("Supabase", "Connecting to Supabase...");
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    //Flush dso_objects table
    log.warn("Supabase", "Cleaning dso_objects table...");
    await supabase.from('dso_objects').delete().not('id', 'is', null);

    log.info("Supabase", "Loading json data...");
    const dso_data: DSORow_processed[] = JSON.parse(readFileSync('./out/openngc_db_parsed.json', 'utf-8'))//.filter((dso: DSORow_processed) => dso.messier.length > 0);

    log.play("Supabase", `Inserting ${dso_data.length} rows...`);
    const { data, error } = await supabase
        .from('dso_objects')
        .insert<Database["public"]["Tables"]["dso_objects"]["Insert"]>(dso_data);

    if (error) {
        log.error("Supabase", `Error inserting data ${error.message}`);
        console.error(error);
    } else {
        log.success("Supabase", "Data inserted successfully");
    }
}

main();

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