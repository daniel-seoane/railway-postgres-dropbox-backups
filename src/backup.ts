import { exec } from "child_process";
import { Dropbox, Error, files } from 'dropbox'; // eslint-disable-line no-unused-vars
import { readFile } from 'fs'

import { env } from "./env";

const uploadToDropbox = async ({ name, path }: { name: string, path: string }) => {
  console.log("Uploading backup to Dropbox...");

  const dbx = new Dropbox({ accessToken: env.DROPBOX_ACCESS_TOKEN });

  readFile(path, (err, contents) => {
    if (err) {
      console.log('Error: ', err);
      console.log("Backup upload failed...")
    }

    dbx.filesUpload({ path: env.DROPBOX_PATH + name, contents })
      .then((response: any) => {
        console.log(response);
        console.log("Backup uploaded to Dropbox...");
      })
      .catch((uploadErr: Error<files.UploadError>) => {
        console.log(uploadErr);
        console.log("Backup upload failed...")
      });
  });

}

const dumpToFile = async (path: string) => {
  console.log("Dumping DB to file...");

  await new Promise((resolve, reject) => {
    exec(
      `pg_dump ${env.BACKUP_DATABASE_URL} -F t | gzip > ${path}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error: JSON.stringify(error), stderr });
          return;
        }

        resolve(undefined);
      }
    );
  });

  console.log("DB dumped to file...");
}

export const backup = async () => {
  console.log("Initiating DB backup...")

  const timestamp = new Date().toISOString()
  const filename = `backup-${timestamp}.tar.gz`
  const filepath = `/tmp/${filename}`

  await dumpToFile(filepath)
  await uploadToDropbox({ name: filename, path: filepath })

  console.log("DB backup complete...")
}
