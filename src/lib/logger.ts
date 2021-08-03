import { createLogger, format, transports } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const { NODE_ENV } = process.env;

const transport =
    NODE_ENV !== 'production'
        ? [
              // 개발일때
              new transports.Console({
                  level: 'debug',
                  format: format.combine(
                      format.colorize(),
                      format.simple(),
                      format.printf((info) => `[${info.level}] - ${info.message}`)
                  ),
                  silent: true
              })
          ]
        : [
              new winstonDaily({
                  level: 'info',
                  datePattern: 'YYYY-MM-DD',
                  dirname: 'log',
                  filename: '%DATE%.log',
                  maxSize: '20m',
                  maxFiles: '30d',
                  zippedArchive: true
              }),
              new winstonDaily({
                  level: 'error',
                  datePattern: 'YYYY-MM-DD',
                  dirname: 'log/error',
                  filename: '%DATE%.error.log',
                  maxSize: '20m',
                  maxFiles: '30d',
                  zippedArchive: true
              })
          ];

export const logger = createLogger({
    format: format.combine(
        format.label({ label: 'travel' }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json(),
        format.errors({ stack: true }),
        format.splat()
    ),
    defaultMeta: { service: 'travel' },
    transports: transport,
    exitOnError: false
});

export const loggerStream = {
    write: (message: string) => {
        logger.info(message);
    }
};
