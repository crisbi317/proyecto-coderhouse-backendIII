import winston from 'winston';

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'magenta',
        debug: 'white'
    }
};

// Logger para desarrollo
const devLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

// Logger para producción
const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: 'errors.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'combined.log',
            level: 'info'
        }),
        new winston.transports.Console({ level: 'info' })
    ]
});

// Seleccionar logger según el entorno
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;
