import winston from 'winston';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/application.log',
      level: 'debug',
      format: winston.format.prettyPrint()
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.prettyPrint()
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports
});

export default logger;