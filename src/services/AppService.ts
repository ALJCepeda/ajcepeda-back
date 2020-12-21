import {json, urlencoded} from "body-parser";
import {readdirSync} from "fs";
import {join} from 'path';
import express from 'express';
const promMid = require('express-prometheus-middleware');
import session from 'express-session';
import * as uuid from "uuid";

import HeaderMiddleware from "../middleware/HeaderMiddleware";
import {publish, container, DependencyContainer, APIError} from 'expressman';
import {setupPassport} from "../config/passport";
import {EntityManager, getConnection} from "typeorm";
import LoggerMiddleware from "../middleware/LoggerMiddleware";
import {tokens} from "../tokens";
import HTTPLogger from "./HTTPLogger";

export class AppService {
  readControllers() {
    const controllerDirectory = join(__dirname, '../controllers');
    readdirSync(controllerDirectory).forEach(function(file) {
      if(file.indexOf('Controller') !== -1) {
        require(`${controllerDirectory}/${file}`);
      }
    });
  }

  async startServer(host:string, port:number):Promise<any> {
    this.readControllers();

    container.register(EntityManager, { useValue: getConnection().createEntityManager() });

    const app = express();

    app.use(promMid({
      metricsPath: '/metrics',
      collectDefaultMetrics: true,
    }));

    app.use(HeaderMiddleware);
    app.use(session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: false
    }));
    app.use(json());
    app.use(urlencoded({ extended: true }));

    setupPassport(app, container);

    app.get('/build.js', (req, res) => {
      res.sendFile(__dirname + '/' + process.env.JS_FILE);
    });

    app.get('/build.js.map', (req, res) => {
      res.sendFile(__dirname + '/' + process.env.JS_FILE + '.map');
    });

    const publishResult = await publish(app, {
      routeDir:'src/routes',
      configureContainer(container: DependencyContainer) {
        container.register(tokens.traceId, {useValue: uuid.v4()})
        container.register(EntityManager, {useValue: getConnection().createEntityManager()});
      },
      onAPIError(container: DependencyContainer, error: any) {
        const logger:HTTPLogger = container.resolve(HTTPLogger);
        logger.error(error);
      }
    });

    const clientRoute = process.env.NODE_ENV === 'development' ? '/' : '*';
    app.get(clientRoute, (req, res) => {
      res.sendFile(__dirname + '/' + process.env.HTML_FILE);
    });

    app.listen(port, host);

    return publishResult;
  }
}

export default new AppService();
