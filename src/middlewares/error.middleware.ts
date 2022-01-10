import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import { logger } from '../utils/logger';

@Middleware({ type: 'after' })
@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    const status: number = error.httpCode;

    if (status === 500) {
      logger.error(error);
    }

    return response.status(status).json(error);
  }
}
