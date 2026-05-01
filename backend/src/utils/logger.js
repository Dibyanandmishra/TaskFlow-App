const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const isProduction = process.env.NODE_ENV === 'production';

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const base = { timestamp, level, message };
  if (Object.keys(meta).length > 0) {
    base.meta = meta;
  }
  return isProduction ? JSON.stringify(base) : `[${timestamp}] [${level}] ${message}${Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''}`;
};

const logger = {
  error(message, meta = {}) {
    console.error(formatMessage(LOG_LEVELS.ERROR, message, meta));
  },

  warn(message, meta = {}) {
    console.warn(formatMessage(LOG_LEVELS.WARN, message, meta));
  },

  info(message, meta = {}) {
    console.info(formatMessage(LOG_LEVELS.INFO, message, meta));
  },

  debug(message, meta = {}) {
    if (!isProduction) {
      console.debug(formatMessage(LOG_LEVELS.DEBUG, message, meta));
    }
  },
};

module.exports = logger;
