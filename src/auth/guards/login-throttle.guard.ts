import { ExecutionContext } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";


export class LoginThrottleGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body.email || 'anonymouse';
        return `login-${email}`;
    }

    protected getLimit(): Promise<number> {
        return Promise.resolve(5);
    }

    protected getTtl(): Promise<number> {
        return Promise.resolve(60000)
    }

    protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
        throw new ThrottlerException(`Too Many Attempts`);
    }

}