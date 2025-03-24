import React, { useState } from 'react';
import './UtilityFaceRecognition.css'
import { Avatar, Button, ConfigProvider, Form, Input, Image } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import { UtilityAuthorizedFaceList } from '../../constants/UtilityPageConstants';
import { CustomDrawer } from '../../components/customDrawer/customDrawer';
import { Field, FieldProps, Formik } from 'formik';
export const UtilityFaceRecognitionPage = () => {
  const startCameraButton = {
    components: {
      Button: {
        colorPrimaryHover: '#7B5DF9',
        colorPrimaryActive: '#c4b5fe'
      }
    }
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
        <div className='face-recognition-camera'>
          <video src="" className='face-recognition-camera-display'/>
          <div className='face-recognition-controller'>
            <ConfigProvider theme={startCameraButton}>
              <Button type='primary' className='face-recognition-start-camera'>Start Camera</Button>
            </ConfigProvider>
            
            <Button type='primary' className='face-recognition-stop-camera'>Stop Camera</Button>
          </div>
        </div>

        <div className='face-recognition-result'>
          <div className='face-recognition-header'>Recognition Result</div>
          <div className='face-recognition-content'>
            <Avatar>JD</Avatar>
            <span>John Doe</span>
          </div>
        </div>

        <div className='face-recognition-auth-list'>
          <h2>Authorized Faces</h2>
          {
            UtilityAuthorizedFaceList.map((item) => (
              <>
                <div className='face-recognition-auth-face' onClick={showDrawer}>
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