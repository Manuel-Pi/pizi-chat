import React, {Component } from 'react';
import { Token } from '../../utils/Token';
import { CreateClassName } from '../../utils/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Messages } from '../Messages/Messages';
import { Text } from '../Text/Text';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { Modal } from '../Modal/Modal';
import { Room, RoomOptions } from '../../../server/models/src/room';
import { relativeTimeThreshold } from 'moment';
import { User, UserOptions } from '../../../server/models/src/user';
import { LobbyScreen } from '../../screens/LobbyScreen/LobbyScreen';
const style = require('./app.less').toString();


type AppProps = {
    socket: any
    user: User
    customSwitch: HTMLElement
    rooms: Room[]
}

type AppState = {
    token: any
    open: boolean
    unReadMessages: {string?: number}
    screen: string
    lobby: boolean
    modal: any
    room: Room
    rooms: Room[]
}

export class App extends Component<AppProps, AppState> {
    ref: any;
    activeVideo: boolean;
    videoRef: any;
    stream: any;

    constructor(props: AppProps){
        super(props);
        this.state = {
            token: {},
            open: false,
            unReadMessages: {},
            screen: "text",
            lobby: false,
            modal: null,
            room: props.rooms[0],
            rooms: props.rooms
        };

        this.activeVideo = false;
        this.ref = React.createRef();
        this.videoRef = React.createRef();
    }

    componentDidMount(){
        Token.getToken().then(token => token && this.setState({token}));
        // Try to reconnect
        this.props.socket.on("connect", () => {
            // TODO: implement
            this.props.user && this.props.socket.emit("login", this.props.user.name);
        });

        this.props.socket.on('message', (message: any) => {
            if(this.state.room.id === message.roomId){
                this.state.room.messages.push(message);
                const unread = this.state.unReadMessages[this.state.room.id] || 0;
                this.setState({
                    room: this.state.room, 
                    unReadMessages: {...this.state.unReadMessages, [this.state.room.id]: this.state.open ? 0 : (unread+ 1)}
                });
            } else {
                let unReadMessages = {...this.state.unReadMessages};
                console.log(JSON.stringify(unReadMessages));
                this.state.rooms.filter(room => room.id === message.roomId).forEach(room => {
                    unReadMessages[room.id] = unReadMessages[room.id] ? (unReadMessages[room.id] + 1) : 1;
                    console.log(JSON.stringify(unReadMessages));
                    room.messages.push(message)
                });
                this.setState({
                    rooms: this.state.rooms, 
                    unReadMessages
                });
            }
            
            if(message.audio){
                const audioBlob = new Blob(message.audio);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            }
        });

        this.props.socket.on('roomData', (room:RoomOptions) => {
            this.setState({room: new Room(room), lobby: false, unReadMessages: {...this.state.unReadMessages, [room.id]: 0}});
        });
        
        this.props.socket.on('roomList', (rooms:RoomOptions[]) => {
            this.setState({rooms: rooms.map(room => new Room(room))});
        });

        this.props.socket.on('roomAdded', (room:RoomOptions) => {
            if(room.allowedUsers.includes(this.props.user.name)){
                if(room.owner.name === this.props.user.name){
                    this.props.socket.emit("joinRoom", room.id);
                    return;
                }
            }
        });

        if(this.props.customSwitch){
            console.log("custom switch: " + this.props.customSwitch);
            this.props.customSwitch.addEventListener('click', (e:any) => {
                console.log("clicks");
                this.setState({open: true, unReadMessages: {...this.state.unReadMessages, [this.state.room.id]: 0}});
            });
        }
    }

    async callUser(socketId: string) {
        const peerConnection = new RTCPeerConnection();
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        
        this.props.socket.emit("call-user", {
          offer,
          to: socketId
        });
    }

    toogleMenu(){
        this.setState({lobby: !this.state.lobby});
    }

    render(){

        const className = CreateClassName({
            "pizi-chat_chat": true,
            "open": this.state.open
        }); 

        const pastilleClassName = CreateClassName({
            "pastille": true,
            "hidden": !!this.props.customSwitch
        });

        const screenTextClassName = CreateClassName({
            "hidden": this.state.screen !== "text"
        }, "screen screen-text");

        const screenVideoClassName = CreateClassName({
            "hidden": this.state.screen !== "video"
        }, "screen screen-video");

        const screenPhoneClassName = CreateClassName({
            "hidden": this.state.screen !== "phone"
        }, "screen screen-phone");

        if(this.state.screen === "video" && !this.activeVideo){
            navigator.getUserMedia(
                { video: true, audio: true },
                stream => {
                    if (this.videoRef) {
                        this.videoRef.current.srcObject = stream;
                    }
                },
                error => {
                    console.warn(error.message);
                }
            );

            this.activeVideo = true;
        } else if (this.state.screen === "text" && this.activeVideo){
            this.videoRef.current.srcObject.getTracks().forEach((track: any) => {
                track.stop();
              });
            this.videoRef.current.srcObject = null;
            this.activeVideo = false;
        }

        const unread = Object.values(this.state.unReadMessages).reduce((total, current) => total + current,0);

        return  <>
                    <style dangerouslySetInnerHTML={{__html: style}}></style>
                    <div className={className} ref={this.ref}>
                        <div className={pastilleClassName} onClick={e => this.setState({open: true, unReadMessages: {...this.state.unReadMessages, [this.state.room.id]: 0}})}>
                            <FontAwesomeIcon icon="comment"/>
                            <span className="unread">{unread ? unread: ""}</span>
                        </div>
                        <div className="pizi-chat_main">
                            <div className="header" onClick={e => this.state.lobby && this.toogleMenu()}>
                                <FontAwesomeIcon icon="ellipsis-v" onClick={e => this.toogleMenu()}/>
                                <div className="title">
                                    <div>
                                        <div>Room</div>
                                        <div>{this.state.room.getCleanName(this.props.user.name)}</div>
                                    </div>
                                    <span className="users">
                                        {this.state.room.users.length}
                                        <FontAwesomeIcon icon="user"/>
                                    </span>
                                </div>
                                <FontAwesomeIcon icon="times" onClick={e => this.setState({open: false})}/>
                            </div>
                            <div className={this.state.room.users.length === 2  ? "actions" : "actions disabled"}>
                                <FontAwesomeIcon icon="video" className={this.state.room.users.length === 2 &&this.state.screen === "video" ? "active" :  ""} onClick={e => this.setState({screen: "video"})}/>
                                <FontAwesomeIcon icon="phone" className={this.state.screen === "phone" ? "active" :  ""} onClick={e => this.setState({screen: "phone"})}/>
                                <FontAwesomeIcon icon="comment-dots" className={this.state.screen === "text" ? "active" :  ""} onClick={e => this.setState({screen: "text"})}/>
                            </div>
                            <div className={screenTextClassName}>
                                <Messages messages={this.state.room.messages} username={this.props.user.name}/>
                                <Text   user={this.props.user.name}
                                        roomId={this.state.room && this.state.room.id}
                                        socket={this.props.socket}
                                        onAskMedia={(callback) => this.setState({modal: <Modal  type="confirm" 
                                                                                                onClose={() => this.setState({modal: null})}
                                                                                                onConfirm={() => {
                                                                                                    this.setState({modal: null});
                                                                                                    callback();
                                                                                                }}>
                                                                                            Activer l'enregistrement audio ?
                                                                                        </Modal>})}/>
                            </div>
                            <div className={screenVideoClassName}>
                                <video autoPlay className="remote-video" id="remote-video"></video>
                                <video autoPlay ref={this.videoRef} muted className="local-video" id="local-video"></video>
                                <div>
                                    <FontAwesomeIcon icon="video-slash" />
                                    <FontAwesomeIcon icon="sync-alt" />
                                </div>
                            </div>
                            <div className={screenPhoneClassName}>
                                <div>
                                    <span>0:00</span>
                                    <FontAwesomeIcon icon="phone" />
                                    <FontAwesomeIcon icon="microphone-slash" />
                                </div>
                            </div>
                            <LobbyScreen    display={this.state.lobby}
                                            unReadMessages={this.state.unReadMessages}
                                            socketUser={this.props.user}
                                            rooms={this.state.rooms}
                                            onJoinRoom={room => {
                                                this.props.socket.emit("joinRoom", room.id);
                                                this.toogleMenu();
                                            }}
                                            onCreateRoom={room => this.props.socket.emit("addRoom", room.getJson())}
                                            onLeaveRoom={room => {
                                                this.props.socket.emit("leaveRoom", room.id);
                                                this.setState({room: this.state.rooms[0]})
                                            }}/>
                            {this.state.modal}
                        </div>
                    </div>
                </>
    }
}