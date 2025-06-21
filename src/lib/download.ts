import { pipeline as streamPipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import got from "got";



//Utility functions
import { checkDir } from "./dirUtils.ts";
import log from "./log.ts"

function onError(error) {
  console.error("Failure - download failed");
  console.error(error);
}

export default function download(url: string, savePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    //Start stream
    const readStream = got.stream(url, { throwHttpErrors: false });
    log.play("Download", `Downloading file as ${path.basename(savePath)}...`);
    const spinner = log.progress.init("Download", "Downloading file...");

    readStream.on("response", async (response) => {
      if (response.headers.age > 3600) {
        console.log("Failure - response too old");
        readStream.destroy(); // Destroy the stream to prevent hanging resources.
        log.progress.fail(spinner, "Download", "Response too old");
        reject("Response too old");
      }

      // Prevent `onError` being called twice.
      readStream.off("error", (error) => {onError(error); log.progress.fail(spinner, "Download", "Download failed"); reject("Download failed");});

      try {
        checkDir(path.resolve(savePath));

        await streamPipeline(readStream, createWriteStream(path.resolve(savePath)));

        resolve();

        log.progress.succeed(spinner, "Download", "Download finished");
      } catch (error) {
        onError(error);
      }
    });

    readStream.once("error", (error) => {onError(error); reject("Download failed");});

    readStream.on("downloadProgress", (progress) => {
      /* console.log(`Downloaded ${Math.floor(progress.percent * 100)}%`); */
      log.progress.update(spinner, "Download", `Downloaded ${Math.floor(progress.percent * 100)}%`);
    });
  });
}
