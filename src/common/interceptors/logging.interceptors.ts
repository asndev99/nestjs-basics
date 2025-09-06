// logging.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: Logger) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const httpCtx = context.switchToHttp();
        const request = httpCtx.getRequest<Request & { user?: any }>();
        const response = httpCtx.getResponse();

        const { method, url, body, query, headers } = request as any;
        const userId = (request as any)?.user?.id ?? 'unauthenticated';
        const userAgent = headers['user-agent'] || 'unknown';
        const startTime = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const duration = Date.now() - startTime;
                const statusCode = (response as any)?.statusCode;

                this.logger.info('HTTP Request Completed', {
                    method,
                    url,
                    statusCode,
                    durationMs: duration,
                    userId,
                    userAgent,
                    query,
                });
            }),
            catchError((err) => {
                const duration = Date.now() - startTime;
                const statusCode = (response as any)?.statusCode ?? 500;

                this.logger.error('HTTP Request Failed', {
                    method,
                    url,
                    statusCode,
                    durationMs: duration,
                    userId,
                    userAgent,
                    error: err.message,
                    stack: err.stack,
                });

                throw err;
            }),
        );
    }
}
