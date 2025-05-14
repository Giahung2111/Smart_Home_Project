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
    };

    const [microphoneStatus, setMicrophoneStatus] = useState('off'); // off, on
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState('');
    const [transcription, setTranscription] = useState('');

    const handleMicrophoneControl = async () => {
        try {
            setIsStarting(true);
            setError('');
            
            const response = await axios.post(UtilityAPI.microphoneControlUrl, {
                action: microphoneStatus === 'off' ? 'on' : 'off'
            });

            if (response.data.status === 200) {
                const data = response.data.data;
                setTranscription(data.transcription || '');
                setMicrophoneStatus('on');
            } else {
                throw new Error(response.data.message || 'Failed to start recognition');
            }
        } catch (error) {
            console.error('Speech recognition error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
            setMicrophoneStatus('off');
        } finally {
            setIsStarting(false);
        }
    };

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
                        onClick={handleMicrophoneControl}
                        disabled={isStarting}
                    />
                </ConfigProvider>
                <div className='speech-recognition-status'>
                    {microphoneStatus === 'on' && (
                        <div>
                            <span className='status-text'>Listening...</span>
                            <div className={`status-indicator on`}>
                                {isStarting && <div className='status-indicator-spinner'></div>}
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className='speech-recognition-error'>
                            <span className='error-text'>Error: {error}</span>
                            <div className='status-indicator error'>
                                {isStarting && <div className='status-indicator-spinner'></div>}
                            </div>
                        </div>
                    )}
                </div>
                <div className='transcription-container'>
                    <h2>Transcription</h2>
                    <div className='transcription-text'>
                        {transcription || 'No speech detected yet'}
                    </div>
                </div>
            </div>
        </div>
    );
};