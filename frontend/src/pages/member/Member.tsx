import { render } from "@testing-library/react";
import { CustomTable } from "../../components/customTable/CustomTable";
import { ActionsColumn, MemberPageColumns } from "../../constants/constants";
import './Member.css'

const data = [
  {
    key: "1",
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "012345567",
    role: "Admin",
    status: "Active" 
  },
  {
    key: "2",
    id: 2,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "012345567",
    role: "Admin",
    status: "Inactive" 
  },
  {
    key: "3",
    id: 3,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "012345567",
    role: "User",
    status: "Active" 
  },
  {
    key: "4",
    id: 4,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "012345567",
    role: "Admin",
    status: "Active" 
  },
  {
    key: "5",
    id: 5,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "012345567",
    role: "Admin",
    status: "Active" 
  },
  {
    key: "6",
    id: 6,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "012345567",
    role: "Admin",
    status: "Inactive" 
  }
]

export const Member = () => {
  const userRole = "Admin";
  let columns = userRole === "Admin"? [...MemberPageColumns, ActionsColumn] : MemberPageColumns;
  return (
    <div className="container rounded-xl shadow-md">
      <h1 className="title">Members</h1>
      <CustomTable columns={columns} data={data} pagination={{pageSize:5}}/>
    </div>
  );
};
