import React, { useState } from 'react';
import { AudioFilled } from '@ant-design/icons'
import { Button, ConfigProvider } from 'antd';
import './UtilitySpeechRecognition.css'
import { UtilityAPI } from '../../services/utility/utilityAPI';
import axios from 'axios';

export const UtilitySpeechRecognitionPage = () => {
    const microphoneBackground = {
        components: {
            Button: {
                colorPrimaryHover: '#7B5DF9',
                colorPrimaryActive: '#c4b5fe',
            },
        },
    }

    const [onMicrophone, setOnMicrophone] = useState("off")

    const handleMicrophoneControl = async () => {
        if(onMicrophone == "on") {
            setOnMicrophone("off")
        } else {
            setOnMicrophone("on")
        }

        const response = await axios.post(UtilityAPI.microphoneControlUrl, {
            "action" : onMicrophone
        })

        console.log(response.data)
    }

    return (
        <div className='speech-recognition-page'>
            <h1>Speech Recognition</h1>
            <div className='speech-recognition-content'>
                <ConfigProvider theme={microphoneBackground}>
                    <Button 
                        type='primary' 
                        size='large' 
                        shape='circle' 
                        style={{ width: '60px', height: '60px' }}
                        icon={<AudioFilled />} 
                        className='utility-speech-icon'
                        onClick={handleMicrophoneControl}/>
                </ConfigProvider>
                <h2>Click the microphone to start recording</h2>
            </div>
        </div>
    );
};