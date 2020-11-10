import { User, UserOptions } from "./user";

export interface RoomOptions{
    id: string
    name: string
    private?: boolean
    users?: UserOptions[]
    allowedUsers?: string[]
    owner: User
    messages?: string[]
} 

export class Room{
    id: string
    name: string
    users: User[]
    private: boolean
    allowedUsers: string[]
    owner: User
    messages: string[]
    creation: number

    public static ROOM_EXPIRATION = 0;

    constructor(options:RoomOptions){
        if(!options.name) throw new Error("Namespace need a name!");
        this.id = options.id || options.name;
        this.name = options.name;
        this.owner = options.owner ? new User(options.owner) : null; 
        this.private = options.private || false;
        this.users = options.users ? options.users.map(user => new User(user)) : [];
        this.allowedUsers = options.allowedUsers || [];
        if(this.owner && this.private && !this.allowedUsers.includes(this.owner.name)) this.allowedUsers.push(this.owner.name);
        this.messages = options.messages || [];
        this.creation = new Date().getTime();
    }

    public update(options:RoomOptions, callback?:(room) => void){
        if(options.allowedUsers){
            this.allowedUsers = options.allowedUsers;
            callback && callback(this);
        }
    }

    public disconnectUser(user:User, callback: (room:Room) => void){
        let i = this.users.length;
        while(i--){
            if(this.users[i].name === user.name) {
                this.users.splice(i, 1);
                callback(this);
                console.info("disconnect [" + user.name + "] from room: [" + this.id + "]");
            }
        }
    }

    public addMessage(message:string){
        this.messages.push(message);
        if(this.messages.length > 20) this.messages.shift();
    }

    public addUser(user:User, callback?: (room:Room) => void){
        // Check user is not already present
        if(this.getUsers({name: user.name})[0]) {
            callback(this);
            return;
        }
        // Check user is allow if it's a private room
        if(this.private && !this.isAllow(user.name)) return;

        this.users.push(user);
        callback(this);

        console.info("add [" + user.name + "] to room [" + this.id + "]");
    }

    public isAllow(userName:string){
        return !this.private || this.allowedUsers.includes(userName) || this.owner.name === userName;
    }

    public getUsers(options?:UserOptions){
        if(!options) return this.users;

        return this.users.filter(user => {
            const unmatched = Object.keys(options).filter(key => user[key] !== options[key]);
            return !unmatched.length;
        })
    }

    public getCleanName(socketUserName){
        return this.name.replace(socketUserName, "").replace("-", "")
    }

    public getJson(){
        return {
            id: this.id,
            name: this.name,
            users: this.users.map(user => user.getJson()),
            private: this.private,
            allowedUsers: this. allowedUsers,
            owner: this.owner && this.owner.getJson(),
            messages: this.messages
        }
    }

}