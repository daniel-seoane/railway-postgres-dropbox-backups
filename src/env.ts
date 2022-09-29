import { envsafe, str } from "envsafe";

export const env = envsafe({
  DROPBOX_ACCESS_TOKEN: str({
    desc: 'You can get it from Dropbox App Console.'
  }),
  DROPBOX_PATH: str(),
  BACKUP_DATABASE_URL: str({
    desc: 'The connection string of the database to backup.'
  }),
  BACKUP_CRON_SCHEDULE: str({
    desc: 'The cron schedule to run the backup on.',
    default: '0 5 * * *',
    allowEmpty: true
  })
})
