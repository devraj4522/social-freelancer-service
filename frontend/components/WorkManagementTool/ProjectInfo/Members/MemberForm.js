import { Form, Input, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { AddMemberToProject } from "@/tools_apicalls/projects";
import { SetLoading } from "@/redux/loadersSlice";
import { getAntdFormInputRules } from "@/utils/helper";
import cookie from "js-cookie";
import { toast } from "react-toastify";

function MemberForm({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) {
  console.log(project.members);
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const token = cookie.get("token");

  const onFinish = async (values) => {
    try {
      // check if email already exists
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );
      if (emailExists) {
        throw new Error("User is already a member of this project");
      } else {
        dispatch(SetLoading(true));
        const response = await AddMemberToProject({
          projectId: project._id,
          email: values.email,
          role: values.role,
        }, token);
        dispatch(SetLoading(false));
        if (response.status === 200) {
          toast.dark(response.data.message);
          reloadData();
          setShowMemberForm(false);
        } else {
          toast.dark(response.data.message);
        }
      }
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };
  return (
    <Modal
      title="ADD MEMBER"
      open={showMemberForm}
      onCancel={() => setShowMemberForm(false)}
      centered
      okText="Add"
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Role" name="role" rules={getAntdFormInputRules}>
          <select>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Empolyee</option>
          </select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MemberForm;
