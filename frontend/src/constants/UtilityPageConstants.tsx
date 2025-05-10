import { Avatar } from "antd";
import { ISidebarItemProps } from "../components/customSidebar/ISidebar";
import { IUtilityAuthorizedFaceProps } from "../pages/utility/IUtility";
import { UtilityFaceRecognitionPage } from "../pages/utility/UtilityFaceRecognitionPage";
import { UtilitySpeechRecognitionPage } from "../pages/utility/UtilitySpeechRecognitionPage";

export const UtitilyConstant : ISidebarItemProps[] = [
    {
        label: 'Face Recognition',
        path: '/utility/face-regconition',
        page: <UtilityFaceRecognitionPage />
    },
    {
        label: 'Speech Recognition',
        path: 'utility/speech-recognition',
        page: <UtilitySpeechRecognitionPage />
    }
]

export const UtilityAuthorizedFaceList : IUtilityAuthorizedFaceProps[] = [
    {
        avatar: <Avatar>JD</Avatar>,
        name: "John Doe"
    },
    {
        avatar: <Avatar>JD</Avatar>,
        name: "John Doe"
    }
]