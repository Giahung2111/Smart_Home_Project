import React, { useState } from 'react';
import './UtilityFaceRecognition.css'
import { Avatar, Button, ConfigProvider, Form, Input, Image } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import { UtilityAuthorizedFaceList } from '../../constants/UtilityPageConstants';
import { CustomDrawer } from '../../components/customDrawer/customDrawer';
import { Field, FieldProps, Formik } from 'formik';
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

  const [authUser, setAuthUser] = useState({
    identity : "",
    dootControlSuccess: 0
  })

  const handleCameraControlOn = async () => {
    const response = await axios.post(UtilityAPI.cameraControlUrl, {
      'action' : 'on',
    })

    console.log(response.data)
  }

  const handleCameraControlOff = async () => {
    const response = await axios.post(UtilityAPI.cameraControlUrl, {
      'action' : 'off',
    })

    const data = response.data.data;
    setAuthUser({
      identity : data.identity,
      dootControlSuccess : data.door_control_success,
    })

  }

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const initialValues = {}

  const onSubmit = () => {}

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
                onClick={handleCameraControlOn}>Start Camera</Button>
            </ConfigProvider>
            
            <Button 
              type='primary' 
              className='face-recognition-stop-camera'
              >Stop Camera</Button>
          </div>
        </div>

        <div 
          className='face-recognition-result'
          style={{backgroundColor: 'var(--border-color)', color: 'var(--text-color)'}}>
          <div className='face-recognition-header'>Recognition Result</div>
          <div className='face-recognition-content'>
            <Avatar>{getShortenName(authUser.identity)}</Avatar>
            <span>{authUser.identity}</span>
          </div>
        </div>

        <div 
          className='face-recognition-auth-list'
          style={{backgroundColor: 'var(--border-color)', color: 'var(--text-color)'}}
        >
          <h2>Authorized Faces</h2>
          {
            UtilityAuthorizedFaceList.map((item) => (
              <>
                <div 
                  className='face-recognition-auth-face' 
                  onClick={showDrawer}
                  style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}
                  >
                  {item.avatar} <span>{item.name}</span>
                </div>
                <CustomDrawer
                  open={open}
                  onClose={onClose}
                  title="Face Information"
                >
                  <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                  >
                    <Form className='face-auth-information'>
                      <div style={{width: '100%'}}>
                        <label htmlFor='name'>
                          Name <span style={{color: 'red'}}>*</span>
                        </label>
                        <Field name='name'>
                          {({field} : FieldProps) => (
                            <Input 
                              {...field}
                              suffix={<EditOutlined />}
                            />
                          )}
                        </Field>
                      </div>
                      <div  style={{width: '100%'}}>
                        <label htmlFor='image'>
                          Image <span style={{color: 'red'}}>*</span>
                        </label>
                        <Image
                          width={300}
                          height={300}
                          src=""
                          preview={false}
                          style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '8px',
                            padding: '8px',
                            margin: '0px 0px 0px 15px'                
                          }} />
                      </div>                      
                    </Form>
                  </Formik>
                </CustomDrawer>
              </>
            ))
          }
        </div>
      </div>
    </div>
  );
};