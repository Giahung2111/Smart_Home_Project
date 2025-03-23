import { Button, ConfigProvider } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import './SettingsTheme.css'

export const SettingsTheme = () => {
    const lightTheme = {
        components: {
        Button: {
            colorPrimaryHover: '#7B5DF9',
            colorPrimaryActive: '#c4b5fe',
        },
        },
    };
      
    const darkTheme = {
        components: {
            Button: {
                colorPrimaryHover: '#1a1515',
                colorPrimaryActive: '#6e6a6a',
            },
        },
    }

    return(
            <div className='theme-container'>
                <h1>Theme</h1>
                <div className='theme-content'>
                    <h2>Dark Mode</h2>
                    <div className='change-theme-buttons'>
                        <ConfigProvider theme={lightTheme}>
                            <Button type='primary' icon={<SunOutlined />} className='light-theme'>Light</Button>
                        </ConfigProvider>
                        <ConfigProvider theme={darkTheme}>
                            <Button type='primary' icon={<MoonOutlined />} className='dark-theme'>Dark</Button>
                        </ConfigProvider>
                    </div>
                </div>
            </div>
    )
}