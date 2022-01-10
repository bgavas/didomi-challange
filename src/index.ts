import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import './db/connection';
import { Container } from 'typedi';
import { AppServer } from './server';

const appServer = Container.get(AppServer);
appServer.setupStatusRoute();
appServer.setupSwaggerDocs();
appServer.startServer();
