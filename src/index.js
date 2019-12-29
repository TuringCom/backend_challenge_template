import '@babel/polyfill';
import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import morgan from 'morgan';
import log from 'fancy-log';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import router from './routes';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const corsOptions = {
  credentials: true,
  origin: [],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// compression and header security middleware
app.use(compression());
app.use(helmet());

app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(expressValidator());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false,
    expressFormat: true,
    colorize: true,
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  })
);

app.use('/stripe/charge', express.static(`${__dirname}/public`));

app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Resource does not exist');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    log(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message,
        error: err,
      },
      status: false,
    });
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  return res.status(err.status || 500).json({
    error: {
      message: err.message,
      error: {},
    },
    status: false,
  });
});

// configure port and listen for requests
const port = parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) || 80;
export const server = app.listen(port, () => {
  log(`Server is running on http://localhost:${port} `);
});

export default app;
