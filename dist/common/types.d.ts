export type RequestWithUser = Request & {
    user: {
        username: string;
    };
};
