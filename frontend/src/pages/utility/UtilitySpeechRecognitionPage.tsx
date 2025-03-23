import React from 'react';
import { AudioFilled } from '@ant-design/icons'
import { Button, ConfigProvider } from 'antd';
import './UtilitySpeechRecognition.css'

export const UtilitySpeechRecognitionPage = () => {
    const microphoneBackground = {
        components: {
            Button: {
                colorPrimaryHover: '#7B5DF9',
                colorPrimaryActive: '#c4b5fe',
            },
        },
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
                        icon={<AudioFilled />} className='utility-speech-icon'/>
                </ConfigProvider>
                <h2>Click the microphone to start recording</h2>
            </div>
        </div>
    );
};