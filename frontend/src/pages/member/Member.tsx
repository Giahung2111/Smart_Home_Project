import { CustomTable } from "../../components/customTable/CustomTable";
import { ActionsColumn } from "../../constants/constants";
import { MemberPageColumns, UserRoleConstant } from "../../constants/MemberPageConstants";
import { useEffect, useState } from "react";
import axios from "axios";
import { IMemberDrawerProps, IMemberTableProps } from "./IMember";
import { CustomDrawer } from "../../components/customDrawer/customDrawer";
import { useAtom } from "jotai";
import { memberDrawerAtom } from "../../Store/Drawers/memberDrawer";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { Button, Input, Select } from "antd";
import './Member.css'
import { MemberAPI } from "../../services/member/memberAPI";

export const Member = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const [users, setUsers] = useState<IMemberTableProps[]>([])
  const [record, setSelectedUser] = useState<IMemberTableProps | undefined>(undefined);
  const getAllMembersUrl = MemberAPI.getAllMembersUrl;
  const deleteMemberUrl = MemberAPI.deleteMemberUrl;
  const updateMemberUrl = MemberAPI.updateMemberUrl;
  const [open, setOpen] = useAtom(memberDrawerAtom)
  const onClose = () => {
    setOpen(false);
  }

  const [initialValues, setInitialValues] = useState<IMemberDrawerProps>({
    FullName: "",
    Role: "",
    Phone: ""
  })

  const getAllUsers = async () => {
    const response = await axios.get(getAllMembersUrl);
    const data = response.data.data;
    console.log("data", data)
    const usersData = data.map((user : IMemberTableProps, index: number) => ({
      key: (index + 1).toString(),
      UserID: user.UserID,
      FullName: user.FullName,
      Phone: user.Phone,
      Role: user.Role,
      Status: user.Status? "Active" : "Inactive"
    }))

    setUsers(usersData);
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const handleSelectedUser = (record : IMemberTableProps) => {
    setInitialValues({
      FullName: record?.FullName,
      Phone: record?.Phone,
      Role: record?.Role,
    })

    setSelectedUser(record);
    setOpen(true);
  }

  const handleDeleteSelectedUser = async (record : IMemberTableProps) => {
    try {
      console.log("record", record)
      const response = await axios.delete(`${deleteMemberUrl}${record.UserID}`)

      if(response.data.status === 200) {
        getAllUsers()
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div 
      className="container rounded-xl shadow-md"
      style={{backgroundColor: 'var(--background-color)', color: 'var(--text-color)'}}>
      <h1 className="title">Members</h1>
        <CustomTable 
          columns={
            currentUser.role === "admin"? 
            [...MemberPageColumns, 
              {...ActionsColumn, 
              render: (_, record) => ActionsColumn.render(
                () => handleSelectedUser(record),
                {
                  placement: "topLeft",
                  title: `Delete user ${record.FullName}`,
                  description: `Do you want to delete user ${record.FullName}`,
                  onConfirm: () => handleDeleteSelectedUser(record)
                }
              )}] : MemberPageColumns} 
          data={users} 
          pagination={{pageSize:5}}
          />
        <CustomDrawer
          open={open}
          onClose={onClose}
        >
          <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting, resetForm }) => {

                  if(record) {
                    axios.patch(`${updateMemberUrl}${record.UserID}`, values)
                    .then(() => {
                      getAllUsers();
                      onClose();
                    })
                    .catch(error => console.log(error))
                    .finally(() => setSubmitting(false))
                  }
                  resetForm()
                }}
            >
                {({ isSubmitting, handleSubmit }) => (
                <Form className='member-form-container'> 
                    <div className='member-form-input'>
                        <label htmlFor='FullName'>Name</label>
                        <Field name='FullName'>
                            {({field}: FieldProps) => (
                                <Input 
                                    {...field}
                                    className='member-input'
                                />
                            )}
                        </Field>
                        <ErrorMessage name='FullName' />
                    </div>   

                    <div className='member-form-input'>
                        <label htmlFor='Phone'>Phone number</label>
                        <Field name='Phone'>
                            {({field}: FieldProps) => (
                                <Input 
                                    {...field}
                                    className='member-input'
                                />
                            )}
                        </Field>
                        <ErrorMessage name='Phone' />
                    </div>

                    <div className='member-form-input'>
                        <label htmlFor="Role">User Role</label>
                        <Field name='Role'>
                            {({ field, form } : FieldProps) => (
                                <Select 
                                    {...field}
                                    placeholder='User role'
                                    options={UserRoleConstant}
                                    onChange={(value) => form.setFieldValue('Role', value)}
                                    style={{width: '100%'}}
                                />
                            )}
                        </Field>
                        <ErrorMessage name='Role' />
                    </div>

                    <div className="member-form-input">
                      <Button 
                        type='primary' 
                        style={{width: '100%', backgroundColor: 'var(--primary-color)'}}
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    </div>
                </Form>
                )}
            </Formik>
        </CustomDrawer>
    </div>
  );
};
