import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type TextProps = {
    onSendMessage: (message: string) => void
}
 
export const Text: FunctionComponent<TextProps> = ({onSendMessage}) => {
    const [text, setText] = useState("");

    const sendMessage = () => {
        if(!text) return;
        onSendMessage(text);
        setText("");
    }

    return  <div className="pizi-chat_text" >
                <textarea   className="pizi-chat_text_text" 
                            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                            onKeyDown={e => {
                                if(e.key === 'Enter'){
                                    sendMessage();
                                    e.preventDefault();
                                }}}
                            value={text}>
                </textarea>
                <button onClick={sendMessage}>
                    <FontAwesomeIcon icon="paper-plane" />
                </button>
            </div>
}