import * as React from "react";
import * as ReactDOM from "react-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { App } from "./components/App/App";
import { faComment} from '@fortawesome/free-solid-svg-icons/faComment';
import { faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import { timeStamp } from "console";
import {faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import {faCommentDots} from "@fortawesome/free-solid-svg-icons/faCommentDots";
import {faUsers} from "@fortawesome/free-solid-svg-icons/faUsers";
import {faVideo} from "@fortawesome/free-solid-svg-icons/faVideo";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons/faSyncAlt";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { User } from "../server/models/src/user";
import { Room } from "../server/models/src/room";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";

// Add custom icon to Font Awesome
library.add(    faComment, 
                faTimes, 
                faPaperPlane, 
                faPhone, 
                faCommentDots, 
                faUsers, 
                faVideo, 
                faSignInAlt, 
                faEnvelope, 
                faMicrophone, 
                faEllipsisV, 
                faVideoSlash, 
                faSyncAlt, 
                faMicrophoneSlash, 
                faPlay, 
                faPause,
                faChevronDown,
                faPlus,
                faLock);
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
                this.namespace = options.namespace || "/pizi-chat/moinsdeneuf";
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

        login(username: string){          
                this.socket.on('loginSuccess', (data: any) => {
                        ReactDOM.render(<App    socket={this.socket} 
                                                user={new User({name: username})} 
                                                customSwitch={this.customSwitch} 
                                                rooms={data.rooms.map(room => new Room(room))}/>, this.el);
                });

                this.socket.on("connect", () => {
                        username && this.socket.emit("login", username);
                });
        }

        join(roomId:string){
                this.socket.emit("joinRoom", roomId);
        }

        leave(roomId:string){
                this.socket.emit("leaveRoom", roomId);
        }

        toggleChat(force: string){
                if(!force) this.el.classList.toggle("hidden");
                else force === "hide" ? this.el.classList.add("hidden") : this.el.classList.remove("hidden");
        }
}
window.PiziChat = PiziChat;