import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FunctionComponent, useRef, useEffect } from 'react';
import { CreateClassName } from '../../utils/Utils';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

type MessagesProps = {
    messages: any[]
    username: string
}
 
export const Messages: FunctionComponent<MessagesProps> = ({messages, username}) => {
    const messageRef = useRef(null);

    useEffect(() => {
        if(messageRef && messageRef.current) messageRef.current.scrollTo(0, messageRef.current.scrollHeight);
    })

    return  <div className="pizi-chat_messages" ref={messageRef}>
                {
                    messages.map(message => <div className={CreateClassName({"message": true, "sent": message.user === username})}>
                                                <div className="message_user">{message.user}</div>
                                                <span className="message_text">{message.audio ? <AudioPlayer audio={URL.createObjectURL(new Blob(message.audio))} duration={message.duration}/> : message.text}</span>
                                            </div>)
                }
            </div>
}