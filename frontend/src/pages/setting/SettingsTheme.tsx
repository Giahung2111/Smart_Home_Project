import { Button, ConfigProvider } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import './SettingsTheme.css'
import { themeAtom } from '../../Store/Theme/themeAtom';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const SettingsTheme = () => {
    const [mainTheme, setMainTheme] = useAtom(themeAtom)

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', mainTheme);
    }, [mainTheme])
    
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

    const toggleLightTheme = () => {
        setMainTheme('light')
    }

    const toggleDarkTheme = () => {
        setMainTheme('dark')
    }

    return(
            <div 
                className='theme-container'
            >
                <h1>Theme</h1>
                <div 
                    className='theme-content'
                >
                    <h2>Dark Mode</h2>
                    <div className='change-theme-buttons'>
                        <ConfigProvider theme={lightTheme}>
                            <Button 
                                type='primary' 
                                icon={<SunOutlined />} 
                                className='light-theme'
                                onClick={toggleLightTheme}>Light</Button>
                        </ConfigProvider>
                        <ConfigProvider theme={darkTheme}>
                            <Button 
                                type='primary' 
                                icon={<MoonOutlined style={{color: 'var(--text-color)'}}/>} 
                                className='dark-theme'
                                style={{backgroundColor: 'var(--primary-color)', color: 'var(--text-color)'}}
                                onClick={toggleDarkTheme}>Dark</Button>
                        </ConfigProvider>
                    </div>
                </div>
            </div>
    )
}