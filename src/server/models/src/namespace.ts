import { Room, RoomOptions } from "./room";
import { User, UserOptions } from "./user";

const NAMESPACES = {};
const EXPIRED_ROOMS = {};
export const DEFAULT_ROOM__ID = "everyone";

interface NamespaceOptions{
    name: string
    rooms?: any
}

export class Namespace{
    name: string
    rooms: Room[]

    constructor(options:NamespaceOptions){
        if(!options.name) throw new Error("Namespace need a name!");
        this.name = options.name;
        this.rooms = [new Room({id: DEFAULT_ROOM__ID, name: "Everyone", owner: null})];
    }

    /* -------------------------------------- STATIC -----------------------------------------*/

    static getDataFromSocket(socket: any, createNamespace:boolean = false){
        const name = socket.nsp.name;
        let namespace = NAMESPACES[name];
        if(!namespace) NAMESPACES[name] = namespace = new Namespace({name});
        if(!namespace) return [];

        const user = namespace.getUser({name: socket.user});
        return [user, namespace];
    }

    /* ---------------------------------------------------------------------------------------*/

    public connectUser(userOptions: UserOptions, callback: (user:User) => void){
        let user = this.getUsers({name: userOptions.name})[0];
        if(user && userOptions.socketId){
            user.socketId = userOptions.socketId;
        } else {
            user = new User(userOptions);
        }
        callback(user);
        return user;
    }

    public disconnectUser(user:User, callback?: () => void, roomCallback?: (room:Room) => void){
        if(!user) return;
        // Remove from rooms
        this.rooms.forEach( room => room.disconnectUser(user, roomCallback));
        callback();
    }

    public joinRoom(roomId:string = DEFAULT_ROOM__ID, user:User, roomCallback?:(room:Room) => void){
        if(!user) return;
        this.rooms.forEach( room => {
            if(room.id === roomId) {
                room.addUser(user, roomCallback);
                if(EXPIRED_ROOMS[room.id]) delete EXPIRED_ROOMS[room.id];
                return;
            }
        });
    }

    public updateRoom(roomOptions: RoomOptions){
        const room = this.getRoom(roomOptions.id);
        if(!room) return;
        room.update(roomOptions);     
    }

    public leaveRoom(roomId:string = DEFAULT_ROOM__ID, user:User, roomCallback?:(room:Room) => void, roomDeleteCallback?:(room:Room) => void){
        if(!user || !roomId || roomId === DEFAULT_ROOM__ID) return;
        this.rooms.forEach( room => {
            if(room.id === roomId) {
                room.disconnectUser(user, roomCallback);
                // Timeout to delete room 
                if(!room.users.length) EXPIRED_ROOMS[room.id] = setTimeout(() => {
                    this.deleteRoom(room.id);
                    roomDeleteCallback(room);
                }, Room.ROOM_EXPIRATION)
                return;
            }
        });
    }

    public deleteRoom(roomId:string){
        this.rooms.splice(this.rooms.findIndex(r => r.id === roomId), 1);
    }

    public createRoom(roomOptions:RoomOptions, callback: (room:Room) => void){
        if(this.getRoom(roomOptions.id)) return;

        const room = new Room(roomOptions);
        this.rooms.push(room);
        callback(room);
    }

    public getUsers(options?:UserOptions){
        const defautRoom = this.getRoom();
        if(!options) return defautRoom.users;

        return defautRoom.users.filter(user => {
            const unmatched = Object.keys(options).filter(key => user[key] !== options[key]);
            return !unmatched.length;
        })
    }

    public getAllUsers(users: UserOptions[]){
        let returnedUsers = [];
        users.forEach(user => returnedUsers.push(...this.getUsers(user)));
        return returnedUsers;
    }

    public getRoomsForUser(user?:User){
        if(!user) user = this.getUser({name: user.name});
        return this.rooms.filter(room => room.isAllow(user.name))
    }

    public getRoom(id:string = DEFAULT_ROOM__ID){
        return this.rooms.filter(room => room.id === id)[0];
    }


    public getUser(options?:UserOptions){
        return this.getUsers({name: options.name})[0]
    }
}