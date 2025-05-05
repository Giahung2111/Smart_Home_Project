import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik'
import { EditOutlined } from '@ant-design/icons'
import './SettingsPersonalInformation.css'
import { Button, Input } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { SettingsAPI } from '../../services/setting/settingAPI'

export const SettingsPersonalInformation = () => {
    const updateCurrentUserInfoUrl = SettingsAPI.updateCurrentUserUrl;

    const userData = JSON.parse(localStorage.getItem('user') as string)
    const [initialValues, setInitialValues] = useState({
        Email: '',
        Phone: '',
        Username: userData.username,
        Role: userData.role
    });

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${SettingsAPI.getAllUsersUrl}${userData.id}`)

            setInitialValues({
                Email: response.data.data.email,
                Phone: response.data.data.phone,
                Username: userData.username,
                Role: userData.Role
            });

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
                                {({ field }: FieldProps) => (
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