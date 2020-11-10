import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CreateClassName } from '../../utils/Utils';

import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';

AudioRecorder.encoder = mpegEncoder
AudioRecorder.prototype.mimeType = 'audio/mpeg'
const MediaRecorder = AudioRecorder

type TextProps = {
    socket: any
    user: string
    roomId: string
    onAskMedia:(callback: () => void) => void
}

let mediaRecorder:any = null;
 
export const Text: FunctionComponent<TextProps> = ({socket, user, roomId, onAskMedia}) => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const [recordAudio, setRecordAudio] = useState(false);
    const [allowMedia, setAllowMedia] = useState(false);


    useEffect( () => {
        if(!navigator.permissions) return;
        navigator.permissions.query({name:'microphone'}).then(function(result) {
            if (result.state === 'granted') {
                initDevice();
            } else if (result.state === 'prompt') {
               //there's no peristent permission registered, will be showing the prompt
            } else if (result.state === 'denied') {
               //permission has been denied
            }
        });
    }, []);

    const initDevice = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            let audioChunks: any = [];
            let startTime: any = null;
            mediaRecorder.addEventListener("dataavailable", (event:any) => {
                audioChunks.push(event.data);
            });
            mediaRecorder.addEventListener("start", () => startTime = (new Date()).getTime());
            mediaRecorder.addEventListener("stop", () => {
                const duration =  (new Date()).getTime() - startTime;
                if(duration < 1000) return;

                socket.emit('audioMessage', {
                    audio: audioChunks,
                    user,
                    roomId,
                    duration
                });
                startTime = null;
                audioChunks = [];
            });
            setAllowMedia(true);
        }).catch(e => {
            alert(e)
        });
    };

    if(recordAudio){
        if(!mediaRecorder && !allowMedia){
            onAskMedia(initDevice);
            setRecordAudio(false);
        } else if(mediaRecorder && recordAudio && mediaRecorder.state !== "recording"){
            mediaRecorder.start();
        }
    }  else if(mediaRecorder && mediaRecorder.state === "recording"){
        mediaRecorder.stop();
    }

    const sendMessage = () => {
        if(!text) return;
        socket.emit('message', {
            text: text,
            user,
            roomId
        });
        setText("");
    }

    useEffect(() => {
        textareaRef.current.focus();
    }, []);

    const className = CreateClassName({
        "pizi-chat_text": true
    });

    return  <div className={className} >
                <textarea   className="pizi-chat_text_text" 
                            ref={textareaRef}
                            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                            onKeyDown={e => {
                                if(e.key === 'Enter'){
                                    sendMessage();
                                    e.preventDefault();
                                }}}
                            value={text}>
                </textarea>
                <button className={"audio-message " + ( allowMedia ? "" : "disabled")} onMouseDown={e => setRecordAudio(true)} onMouseUp={e => setRecordAudio(false)}>
                    <FontAwesomeIcon icon="microphone" />
                </button>
                <button onClick={sendMessage}>
                    <FontAwesomeIcon icon="paper-plane" />
                </button>
            </div>
}