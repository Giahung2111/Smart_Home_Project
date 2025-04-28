import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik'
import { EditOutlined } from '@ant-design/icons'
import * as Yup from 'yup'
import './SettingsPersonalInformation.css'
import { Button, Input } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const SettingsPersonalInformation = () => {
    const settingsUrl = 'http://localhost:8000/api/users/'
    const updateCurrentUserInfoUrl = 'http://localhost:8000/api/users/update/'

    const userData = JSON.parse(localStorage.getItem('user') as string)
    const [initialValues, setInitialValues] = useState({
        Email: '',
        Phone: '',
        Username: userData.username,
        Role: userData.role
    });

    const fetchUserData = async () => {
        try {
            console.log("user data: ", userData)
            const response = await axios.get(`${settingsUrl}${userData.id}`)

            console.log("response", response.data)
            setInitialValues({
                Email: response.data.data.email,
                Phone: response.data.data.phone,
                Username: userData.username,
                Role: userData.Role
            });
            // console.log(initialValues.userEmail);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="settings-personal-information-page">
            <h1>Personal Information</h1>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    try {
                        axios.patch(`${updateCurrentUserInfoUrl}${userData.id}`, {
                            Email: values.Email,
                            Phone: values.Phone,
                            Username: userData.username,
                            Role: userData.role
                        })
                        .then(() => {
                            fetchUserData();
                        })
                    } catch (error) {
                        console.log(error)
                    }

                    setSubmitting(false);
                    resetForm();
                }}
            >
                {({isSubmitting, handleSubmit}) => (
                    <Form className='settings-form-container'>    
                        <div className='settings-form-input'>
                            <label htmlFor='email'>Email<span style={{color: "red"}}>*</span></label>
                            <Field name='email'>
                                {({field}: FieldProps) => (
                                    <Input 
                                        {...field}
                                        suffix={<EditOutlined className='settings-edit'/>}
                                        className='settings-input'
                                        value={initialValues.Email}                                  
                                    />
                                )}
                            </Field>
                            <ErrorMessage name='email' />
                        </div>

                        <div className='settings-form-input'>
                            <label htmlFor='Phone'>Phone number</label>
                            <Field name='Phone'>
                                {({ field, form }: FieldProps) => (
                                    <Input 
                                        {...field}
                                        suffix={<EditOutlined className='settings-edit'/>}
                                        className='settings-input'
                                    />
                                )}
                            </Field>
                            <ErrorMessage name='Phone' />
                        </div>
                        
                        <div className='settings-form-input'>
                            <Button 
                                className='settings-input'
                                type='primary' 
                                style={{height: '2.5rem', marginTop: '1rem', backgroundColor: 'var(--primary-color)'}}
                                onClick={() => handleSubmit()}
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                        </div>       
                    </Form>
                )}   
            </Formik>
        </div>
    )
}