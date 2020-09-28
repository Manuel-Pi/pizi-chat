import * as React from "react";
import * as ReactDOM from "react-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { App } from "./components/App/App";
import { faComment} from '@fortawesome/free-solid-svg-icons/faComment';
import { faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import { timeStamp } from "console";

// Add custom icon to Font Awesome
library.add(faComment, faTimes, faPaperPlane);
// Init Socket,io

declare global {
        interface Window { onPiziChat: any, PiziChat: any}
        const io: any;
}

class PiziChat{
        namespace: string;
        el: HTMLElement;
        customSwitch: HTMLElement;
        socket: any;
        
        constructor(options:{namespace?: string, el?: HTMLElement, customSwitch?: HTMLElement} = {}){
                this.namespace = options.namespace || "/pizi-chat";
                this.socket = io(this.namespace);
                this.customSwitch = options.customSwitch;
                this.el = options.el;

                if(!this.el){
                        this.el = document.createElement('div');
                        document.body.appendChild(this.el);
                }

                this.el.classList.add("pizi-chat");

                if(this.customSwitch) this.el.classList.add("customSwitch");
        }

        login(username: string, roomId: string){
                this.socket.emit('login', username);
                ReactDOM.render(<App socket={this.socket} username={username} room={roomId} customSwitch={this.customSwitch}/>, this.el);

                this.socket.on('loginSuccess', (data: any) => {
                        let rooms = data.rooms.filter((r:any) => r.id === roomId);
                        if(!rooms[0]){
                                this.socket.emit('addRoom', {
                                        id: roomId.toLowerCase(),
                                        name: roomId,
                                        authorized: 'All',
                                        author: username
                                });
                        }
                        this.socket.emit('joinRoom', roomId);
                })

                this.socket.on("connect", () => {
                        username && this.socket.emit("login", username);
                });
        }

        toggleChat(){
                this.el.classList.toggle("hidden");
        }
}
window.PiziChat = PiziChat;