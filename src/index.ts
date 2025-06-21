//download that : https://raw.githubusercontent.com/mattiaverga/OpenNGC/refs/heads/master/database_files/NGC.csv
import { basename, resolve } from "path";

//Utilities
import download from "./lib/download.ts";
import log from "./lib/log.ts";
import { parseDSOCSV } from "./lib/csvUtils.ts";
import { checkDir, checkFile } from "./lib/dirUtils.ts";
import { writeFileSync } from "fs";

const csvFilePath = resolve("./downloads/openngc_db.csv");
const outFilePath = resolve("./out/openngc_db_parsed.json");

function errorExit(message: string, step: number) {
  log.error(`Step ${step}`, message);
  process.exit(1);
}

async function main() {
  const startDate = new Date();

  await log.start("DSO - db");

  log.info("Step 1", "Downloading OpenNGC database CSV file");
  await download(
    "https://raw.githubusercontent.com/mattiaverga/OpenNGC/refs/heads/master/database_files/NGC.csv",
    csvFilePath
  ).catch(() => errorExit("Download failed", 1));

  //Check if file exists
  if (!checkFile(csvFilePath)) errorExit("File does not exist", 1);

  log.space();


  log.info("Step 2", "Parsing and formatting CSV file");

  const data = await parseDSOCSV(csvFilePath);

  log.space();


  log.info("Step 3", `Saving results to ${basename(outFilePath)}...`);

  checkDir(outFilePath);

  await writeFileSync(outFilePath, JSON.stringify(data, null, 2), "utf-8")

  log.success("File save", "Done!");
  
  log.space(2);


  const endDate = new Date();
  const timeDiff = (endDate.getTime() - startDate.getTime()) / 1000;

  log.focus("Main", "Database built successfully!");
  log.success("Main", `Execution took ${timeDiff.toFixed(2)} seconds`);
}

main();
