const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Security: redact sensitive fields before logging
const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'authorization'];

function sanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key of Object.keys(clean)) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      clean[key] = '***REDACTED***';
    } else if (typeof clean[key] === 'object') {
      clean[key] = sanitize(clean[key]);
    }
  }
  return clean;
}

function logRequest(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: Date.now() - start,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  next();
}

module.exports = { logger, sanitize, logRequest };
