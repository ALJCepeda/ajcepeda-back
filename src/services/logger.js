import bluebird from 'bluebird';
import fs from 'fs';
import moment from 'moment';

const stat = bluebird.promisify(fs.stat);
const mkdir = bluebird.promisify(fs.mkdir);
const log = console.log;

const makeLogsDirectory = function() {
  return mkdir('logs', '0740').catch((err) => {
    log(err);
    throw err;
  });
};

const initiateLogsDirectory = function() {
  return stat('logs').catch((err) => {
    if(err.code === 'ENOENT') {
      return makeLogsDirectory();
    } else {
      log('Unexpected error while stating logs directory:', err);
      throw err;
    }
  });
};

const onStreamError = function(streamName) {
  return (err) => {
    log(`${streamName} stream encountered error:`, err);
  };
};

const Logger = function() {
  this.errorCount = 0;
  this.errorStream = null;
  this.accessStream = null;
  this.consoleStream = null;
};

Logger.prototype.init = function() {
  return initiateLogsDirectory().then(() => {
    this.errorStream = fs.createWriteStream('logs/error.log', { flags:'a' });
    this.accessStream = fs.createWriteStream('logs/access.log', { flags:'a' });
    this.consoleStream = fs.createWriteStream('logs/console.log', { flags:'a' });

    this.errorStream.on('error', onStreamError('Error'));
    this.accessStream.on('error', onStreamError('Access'));
    this.consoleStream.on('error', onStreamError('Console'));

    log('Created Log Streams, switching to logger');
    return true;
  });
};

Logger.prototype.timestamp = function() {
  return moment().format('MM-DD HHmm');
};

Logger.prototype.error = function() {
  const timestamp = this.timestamp();

  this.errorCount++;

  this.errorStream.write(`[${this.errorCount}]${timestamp} `);

  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => {
    this.errorStream.write(arg);
  });

  this.errorStream.write(`\n----------------------------------------------------------------\n`);
  this.consoleStream.write(`[${this.errorCount}]${timestamp} Error encountered\n`);
  log(`[${this.errorCount}]${timestamp} Error encountered`);
};

Logger.prototype.access = function () {
  const timestamp = this.timestamp();
  this.accessStream.write(`${timestamp} `);

  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => {
    this.accessStream.write(arg);
  });

  this.accessStream.write(`\n`);
};

Logger.prototype.log = function () {
  const timestamp = this.timestamp();
  this.consoleStream.write(`${timestamp} `);

  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => {
    this.consoleStream.write(arg);
  });

  this.consoleStream.write(`\n`);

  args.unshift(`${timestamp}`);
  log.apply(null, args);
};

Logger.prototype.erroredRequest = function(err, req) {
  this.error(`Request errored: `, err.stack);

  if(req.params) {
    this.error(JSON.stringify(req.params));
  }

  if(req.body) {
    this.error(JSON.stringify(req.body));
  }
};

Logger.prototype.internalError = function(id, res) {
  return (err) => {
    this.error(`${id}: ${err}`);
    return res.status(500).send('This incident has been logged and will be fixed soon!');
  }
};


export default new Logger();
