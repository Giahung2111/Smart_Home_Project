const getAllMembersUrl = `${process.env.REACT_APP_API_BASE_URL}/users`
const deleteMemberUrl = `${process.env.REACT_APP_API_BASE_URL}/users/delete/`
const updateMemberUrl = `${process.env.REACT_APP_API_BASE_URL}/users/update/`

export const MemberAPI = {
    getAllMembersUrl : getAllMembersUrl,
    deleteMemberUrl : deleteMemberUrl,
    updateMemberUrl : updateMemberUrl
}