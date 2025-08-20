const cameraControlUrl = `${process.env.REACT_APP_API_BASE_URL}/utilities/camera/`
const microphoneControlUrl = `${process.env.REACT_APP_API_BASE_URL}/utilities/microphone/`
const faceRecognitionUrl = `${process.env.REACT_APP_API_BASE_URL}/utilities/face_recognition_allowed/`

export const UtilityAPI = {
    cameraControlUrl: cameraControlUrl,
    microphoneControlUrl: microphoneControlUrl,
    faceRecognitionUrl: faceRecognitionUrl
}