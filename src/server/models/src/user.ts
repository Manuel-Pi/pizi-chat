export interface UserOptions{
    name?: string
    socketId?: any
}


export class User{
    name: string;
    socketId: string;

    constructor(options:UserOptions){
        if(!options.name && !options.socketId) throw new Error("User need a name or socket Id!");
        this.name = options.name;
        this.socketId = options.socketId;
    }

    public getJson(){
        return {
            name: this.name,
            socketId: this.socketId
        }
    }
}