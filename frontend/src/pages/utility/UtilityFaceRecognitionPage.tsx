import React, { useState } from 'react';
import './UtilityFaceRecognition.css'
import { Avatar, Button, ConfigProvider } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import { UtilityAuthorizedFaceList } from '../../constants/UtilityPageConstants';
import { UtilityAPI } from '../../services/utility/utilityAPI';
import axios from 'axios';
import { getShortenName } from '../../utils/util';
export const UtilityFaceRecognitionPage = () => {
  const startCameraButton = {
    components: {
      Button: {
        colorPrimaryHover: '#7B5DF9',
        colorPrimaryActive: '#c4b5fe'
      }
    }
  }

  const [cameraStatus, setCameraStatus] = useState('off'); // off, on, starting, error
  const [isStarting, setIsStarting] = useState(false);
  const [authUser, setAuthUser] = useState({
    identity: "",
    doorControlSuccess: 0
  });
  const [error, setError] = useState('');

  const handleCameraControl = async () => {
    try {
      setIsStarting(true);
      setError('');
      
      const response = await axios.post(UtilityAPI.cameraControlUrl, {
        action: cameraStatus === 'off' ? 'on' : 'off'
      });

      if (response.data.status === 200) {
        const data = response.data.data;
        setAuthUser({
          identity: data.identity || "",
          doorControlSuccess: data.door_control_success || 0
        });
        setCameraStatus(cameraStatus === 'off' ? 'on' : 'off');
      } else {
        throw new Error(response.data.message || 'Failed to start recognition');
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setCameraStatus('error');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      <h1>Face Recognition</h1>
      <div className='face-recognition-main'>
        <div 
          className='face-recognition-camera'
          style={{backgroundColor: 'var(--border-color)', color: 'var(--text-color)'}}
          >
          <video src="" className='face-recognition-camera-display'/>
          <div className='face-recognition-controller'>
            <ConfigProvider theme={startCameraButton}>
              <Button 
                type='primary' 
                className='face-recognition-start-camera'
                onClick={handleCameraControl}
                disabled={cameraStatus === 'starting'}
                >
                {cameraStatus === 'starting' ? 'Starting...' : 'Start Camera'}
              </Button>
            </ConfigProvider>
          </div>
          {cameraStatus === 'on' && (
            <div className='face-recognition-status'>
              <span className='status-text'>Camera Status: {cameraStatus === 'on' ? 'On' : 'Off'}</span>
              <div className={`status-indicator ${cameraStatus === 'on' ? 'active' : 'inactive'}`}>
                {isStarting && <div className='status-indicator-spinner'></div>}
              </div>
            </div>
          )}
          {cameraStatus === 'error' && (
            <div className='face-recognition-error'>
              <span className='error-text'>Error: {error}</span>
              <div className='status-indicator error'></div>
            </div>
          )}
          {cameraStatus === 'starting' && (
            <div className='face-recognition-status'>
              <span className='status-text'>Starting Camera...</span>
              <div className={`status-indicator starting`}>
                <div className='status-indicator-spinner'></div>
              </div>
            </div>
          )}
        </div>

        <div 
          className='face-recognition-result'
          style={{backgroundColor: 'var(--border-color)', color: 'var(--text-color)'}}>
          <div className='face-recognition-header'>Recognition Result</div>
          <div className='face-recognition-content'>
            <Avatar>{getShortenName(authUser.identity)}</Avatar>
            <div className='result-details'>
              <span className='result-label'>Identity:</span>
              <span className='result-value'>{authUser.identity}</span>
              <div className='door-control-status'>
                <span className='status-label'>Door Control:</span>
                <span className='status-value'>
                  {authUser.doorControlSuccess ? 'Success' : 'Not Attempted'}
                </span>
              </div>
              <div className='recognition-status'>
                <span className='status-label'>Status:</span>
                <span className={`status-value ${cameraStatus === 'on' ? 'active' : 'inactive'}`}>
                  {cameraStatus === 'on' ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className='face-recognition-auth-list'
          style={{backgroundColor: 'var(--border-color)', color: 'var(--text-color)'}}
        >
          <h2>Authorized Faces</h2>
          {
            UtilityAuthorizedFaceList.map((item) => (
              <div 
                className='face-recognition-auth-face' 
                style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}
              >
                {item.avatar} <span>{item.name}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};