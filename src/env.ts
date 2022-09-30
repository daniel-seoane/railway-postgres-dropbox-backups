import { envsafe, str } from "envsafe";

export const env = envsafe({
  DROPBOX_APP_KEY: str(),
  DROPBOX_APP_SECRET: str(),
  DROPBOX_REFRESH_TOKEN: str(),
  DROPBOX_BACKUP_PATH: str(),
  BACKUP_DATABASE_URL: str({
    desc: 'The connection string of the database to backup.'
  }),
  BACKUP_CRON_SCHEDULE: str({
    desc: 'The cron schedule to run the backup on.',
    default: '0 5 * * *',
    allowEmpty: true
  })
})
