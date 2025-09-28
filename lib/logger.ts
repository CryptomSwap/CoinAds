import pino from 'pino';

// Create logger instance with redaction for sensitive data
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'password',
      'token',
      'authorization',
      'cookie',
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'req.body.password',
      'req.body.token',
      'req.body.authorization',
    ],
    censor: '[REDACTED]',
  },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Helper functions for different log levels
export const log = {
  info: (message: string, data?: any) => logger.info(data, message),
  error: (message: string, error?: any) => logger.error(error, message),
  warn: (message: string, data?: any) => logger.warn(data, message),
  debug: (message: string, data?: any) => logger.debug(data, message),
};

export default logger;
