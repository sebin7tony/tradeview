var winston = require('winston');
var moment = require('moment');
var config = require('../../config/logger-config');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            timestamp: function(){
                var dt = new moment();
                return dt.format('DD-MM-YYYY HH:mm:ss.SSS');
            },
            formatter: function(options){
                var log_str = '';
                logs = options.message.split('\n');
                logs.forEach(function(log, index){
                    log_str = log_str + options.timestamp() + ' | ' + (options.level.toUpperCase()+'       ').slice(0,7) + ' | ' + log;
                    if(index != (logs.length-1)) {
                        log_str = log_str + '\n';
                    }
                });
                return log_str;
            },
            level: config.loggingLevel,
            filename: config.logFileName,
            handleExceptions: true,
            json: false,
            colorize: false
        })
    ],
    exitOnError: config.errorOnExit
});

module.exports = logger;
