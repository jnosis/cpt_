import { getLogger, handlers, setup } from '$std/log/mod.ts';

setup({
  handlers: {
    functionFmt: new handlers.ConsoleHandler('DEBUG', {
      formatter: (logRecord) => {
        const time = logRecord.datetime.toLocaleString('en', {
          hour12: false,
          timeZone: 'Asia/Seoul',
          timeZoneName: 'short',
        });
        let msg = `${time} [${logRecord.levelName}] ${logRecord.msg}`;

        logRecord.args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
        return msg;
      },
    }),
  },

  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['functionFmt'],
    },
  },
});

const logger = getLogger();

export default logger;
