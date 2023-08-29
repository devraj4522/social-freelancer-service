import { Form, Input, Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";
import { CreateProject, EditProject } from "@/tools_apicalls/projects";
import TextArea from "antd/lib/input/TextArea";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function ProjectForm({ show, setShow, reloadData, project, user }) {
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = cookie.get("token");

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (project) {
        // edit project
        values._id = project._id;
        response = await EditProject(values, token);
      } else {
        // create project
        values.owner = user._id;
        values.members = [
          {
            user: user._id,
            role: "owner",
          },
        ];
        response = await CreateProject(values, token);
      }
     
      if (response.status === 200) {
        toast.dark(response.data.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.data.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };
  return (
    <Modal
      title={project ? "EDIT PROJRCT" : "CREATE PROJECT"}
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText="Save"
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={project}
      >
        <Form.Item label="Project Name" name="name">
          <Input placeholder="Project Name" />
        </Form.Item>
        <Form.Item label="Project Description" name="description">
          <TextArea placeholder="Project Description" style={{outline: "2px solid #3795BD", color: '#fff',
        background: "rgb(41, 51, 64)"}} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectForm;
