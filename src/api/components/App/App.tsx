import React, {Component } from 'react';
import { Token } from '../../utils/Token';
import { CreateClassName } from '../../utils/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Messages } from '../Messages/Messages';
import { Text } from '../Text/Text';
const style = require('./app.less').toString();


type AppProps = {
    socket: any
    username: string
    room: string
    customSwitch: HTMLElement
}

type AppState = {
    token: any
    open: boolean
    messages: any[]
    unReadMessages: number
}

export class App extends Component<AppProps, AppState> {
    ref: any;

    constructor(props: AppProps){
        super(props);
        this.state = {
            token: {},
            open: false,
            messages: [],
            unReadMessages: 0
        };

        this.ref = React.createRef();
    }

    componentDidMount(){
        Token.getToken().then(token => token && this.setState({token}));
        // Try to reconnect
        this.props.socket.on("connect", () => {
            // TODO: implement
        });

        this.props.socket.on('message', (message: any) => {
            this.setState({
                messages: [...this.state.messages, message], 
                unReadMessages: this.state.open ? 0 : (this.state.unReadMessages + 1)
            });
        });
        
        if(this.props.customSwitch){
            console.log("custom switch: " + this.props.customSwitch);
            this.props.customSwitch.addEventListener('click', (e:any) => {
                console.log("clicks");
                this.setState({open: true, unReadMessages: 0});
            });
        }
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

        return  <>
                    <style dangerouslySetInnerHTML={{__html: style}}></style>
                    <div className={className} ref={this.ref}>
                        <div className={pastilleClassName} onClick={e => this.setState({open: true, unReadMessages: 0})}>
                            <FontAwesomeIcon icon="comment"/>
                            <span className="unread">{this.state.unReadMessages ? this.state.unReadMessages: ""}</span>
                        </div>
                        <div className="pizi-chat_main">
                            <h2>Chat</h2>
                            <FontAwesomeIcon icon="times" onClick={e => this.setState({open: false})}/>
                            <Messages messages={this.state.messages} username={this.props.username}/>
                            <Text onSendMessage={message => this.props.socket.emit('message', {
                                text: message,
                                user: this.props.username,
                                roomId: this.props.room
                            })}/>
                        </div>
                    </div>
                </>
    }
}