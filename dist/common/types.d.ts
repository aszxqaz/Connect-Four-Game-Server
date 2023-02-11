import { Socket } from 'socket.io';
export type IUser = {
    username: string;
    id: string;
};
export type RequestWithUser = Request & {
    user: IUser;
};
export type SocketWithUser = Socket & {
    request: RequestWithUser;
};
