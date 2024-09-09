import * as winston from 'winston'

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
}

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'white',
}

winston.addColors(logColors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.cli(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: [${info.loggerPrefix}] ${info.message}`,
  ),
)

export const logger = winston.createLogger({
  levels: logLevels,
  level: 'silly',
  format,
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: './data/logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: './data/logs/combined.log' })
  ],
}) as winston.Logger & Record<keyof typeof logLevels, winston.LeveledLogMethod>

export function useServerLogger(loggerPrefix: string) {
  return logger.child({ loggerPrefix })
}
