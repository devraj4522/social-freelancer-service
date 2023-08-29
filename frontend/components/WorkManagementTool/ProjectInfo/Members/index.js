import { Button, Table } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MemberForm from "./MemberForm";
import { RemoveMemberFromProject } from "@/tools_apicalls/projects";
import { SetLoading } from "@/redux/loadersSlice";
import { toast } from "react-toastify";
import cookie from "js-cookie";

function Members({ project, reloadData, user }) {
  const [role, setRole] = React.useState("");
  const [showMemberForm, setShowMemberForm] = React.useState(false);

  const dispatch = useDispatch();
  const isOwner = project.owner._id === user._id;
  const token  = cookie.get("token");

  const deleteMember = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const response = await RemoveMemberFromProject({
        projectId: project._id,
        memberId,
      }, token);
      if (response.status === 200) {
        reloadData();
        toast.dark(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      render: (text, record) => record.user.username,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => record.user.name,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => record.user.email,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => record.role.toUpperCase(),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <Button type="link" danger onClick={() => deleteMember(record._id)}>
          Remove
        </Button>
      ),
    },
  ];

  // if not owner, then don't show the action column
  if (!isOwner) {
    columns.pop();
  }

  return (
    <div>
      <div className="flex justify-end">
        {isOwner && (
          <Button type="default" onClick={() => setShowMemberForm(true)}>
            Add Member
          </Button>
        )}
      </div>

      <div
       className="w-48"
       style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", marginBottom: "1rem"}}
      >
        <span>Select Role</span>
        <select onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="">All</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <Table
        columns={columns}
        dataSource={project.members.filter((member) => {
          if (role === "") {
            return true;
          } else {
            return member.role === role;
          }
        })}
        rowKey="_id"
        className="mt-4"
      />

      {showMemberForm && (
        <MemberForm
          showMemberForm={showMemberForm}
          setShowMemberForm={setShowMemberForm}
          reloadData={reloadData}
          project={project}
        />
      )}
    </div>
  );
}

export default Members;
