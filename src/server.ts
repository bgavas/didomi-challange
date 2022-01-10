import express from 'express';
import { Server } from 'http';
import {
  createExpressServer,
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useContainer,
} from 'routing-controllers';
import { Container, Service } from 'typedi';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { PORT } from './config/config';
import { logger } from './utils/logger';

@Service()
export class AppServer {
  private app: express.Application;
  private server: Server;
  private routeOptions: RoutingControllersOptions;

  constructor() {
    this.routeOptions = {
      routePrefix: '/api',
      defaultErrorHandler: false,
      validation: {
        whitelist: true,
      },
      controllers: [`${__dirname}/modules/**/*.{ts,js}`],
      middlewares: [`${__dirname}/middlewares/**/*.{ts,js}`],
    };

    useContainer(Container);

    // Create server
    this.app = createExpressServer(this.routeOptions);
  }

  getApp() {
    return this.app;
  }

  getServer() {
    return this.server;
  }

  setupStatusRoute() {
    this.app.get('/', (_, res) => res.send('Server running'));
  }

  setupSwaggerDocs() {
    // Parse class-validator classes into JSON Schema:
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, this.routeOptions, {
      components: {
        schemas,
      },
      info: {
        description: 'This is the API docs of `Didomi Challange`',
        title: 'Didomi Challange API',
        version: '1.0.0',
      },
    });

    this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
  }

  startServer() {
    this.server = this.app.listen(PORT, () => {
      logger.info(`Server started at port: ${PORT}`);
    });
  }
}
