import util from 'util';
import winston from 'winston';

const { createLogger, format, transports } = winston;

const combineMessageAndSplat = () => {
  return {
    transform: (info: any, opts: any) => {
      info.message = util.format(info.message, ...info[Symbol.for('splat')] || []);
      return info;
    },
  };
};

export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple(),
    combineMessageAndSplat(),
    format.printf((info: any) => {
      let str = `${info.timestamp} - ${info.level}: ${info.message}`;
      if (info.stack) {
        str += `\nError stack:${info.stack}`;
      }
      return str;
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
      ),
    }),
  ],
});
