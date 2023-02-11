import { RequestWithUser } from 'src/common/types';
export declare class AuthController {
    login(req: RequestWithUser): Promise<{
        user: {
            username: string;
        };
    }>;
    me(req: RequestWithUser): Promise<{
        user: {
            username: string;
        };
    }>;
}
