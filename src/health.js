const os = require('os');
const { logger } = require('./logging');

let startTime = Date.now();

function healthCheck(req, res) {
  const health = {
    status: 'ok',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(os.totalmem() / 1024 / 1024)
    },
    cpu: os.loadavg(),
    timestamp: new Date().toISOString()
  };

  // Warn if memory usage is high
  const memPercent = process.memoryUsage().heapUsed / os.totalmem();
  if (memPercent > 0.8) {
    logger.warn('High memory usage detected', { memPercent });
    health.status = 'degraded';
  }

  res.json(health);
}

module.exports = { healthCheck };
