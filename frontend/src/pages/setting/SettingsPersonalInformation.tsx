import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik'
import { EditOutlined } from '@ant-design/icons'
import * as Yup from 'yup'
import './SettingsPersonalInformation.css'
import { Input } from 'antd'

export const SettingsPersonalInformation = () => {
    const initialValue = {}
    return (
        <div className="settings-personal-information-page">
            <h1>Personal Information</h1>
            <Formik
                initialValues={initialValue}
                onSubmit={() => {}}
            >
                <Form className='settings-form-container'>
                    <div className='settings-form-input'>
                        <label htmlFor='firstname'>FirstName <span style={{ color: "red" }}>*</span></label>
                        <Field name="firstname">
                            {({ field } : FieldProps) => (
                                <Input 
                                    {...field} 
                                    suffix={<EditOutlined className='settings-edit'/>} 
                                    className="settings-input"
                                />
                            )}
                        </Field>
                        <ErrorMessage name="firstname"/>
                    </div>
                    
                    <div className='settings-form-input'>
                        <label htmlFor='lastname'>Last Name <span style={{color: "red"}}>*</span></label>
                        <Field name='lastname'>
                            {({field}: FieldProps) => (
                                <Input 
                                    {...field}
                                    suffix={<EditOutlined className='settings-edit'/>}
                                    className='settings-input'
                                />
                            )}
                        </Field>
                        <ErrorMessage name='lastname' />
                    </div>
                    
                    <div className='settings-form-input'>
                        <label htmlFor='email'>Email<span style={{color: "red"}}>*</span></label>
                        <Field name='email'>
                            {({field}: FieldProps) => (
                                <Input 
                                    {...field}
                                    suffix={<EditOutlined className='settings-edit'/>}
                                    className='settings-input'
                                />
                            )}
                        </Field>
                        <ErrorMessage name='email' />
                    </div>

                    <div className='settings-form-input'>
                        <label htmlFor='phone'>Phone number</label>
                        <Field name='phone'>
                            {({field}: FieldProps) => (
                                <Input 
                                    {...field}
                                    suffix={<EditOutlined className='settings-edit'/>}
                                    className='settings-input'
                                />
                            )}
                        </Field>
                        <ErrorMessage name='phone' />
                    </div>
                </Form>
            </Formik>
        </div>
    )
}