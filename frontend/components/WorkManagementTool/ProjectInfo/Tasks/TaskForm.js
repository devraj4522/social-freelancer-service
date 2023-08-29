import { Button, Form, Input, Modal, Tabs, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddNotification } from "@/tools_apicalls/notifications";
import { CreateTask, UpdateTask, UploadImage } from "@/tools_apicalls/tasks";
import { SetLoading } from "@/redux/loadersSlice";
import { toast } from "react-toastify";
import cookie from "js-cookie";
import upload from "@/utils/upload";

function TaskForm({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
  user,
}) {
  const [selectedTab = "1", setSelectedTab] = React.useState("1");
  const [email, setEmail] = React.useState("");
  const formRef = React.useRef(null);
  const [file = null, setFile] = React.useState(null);
  const [images = [], setImages] = React.useState(task?.attachments || []);
  const dispatch = useDispatch();
  const token = cookie.get("token");

  const onFinish = async (values) => {
    try {
      let response = null;
      const assignedToMember = project.members.find(
        (member) => member.user.email === email
      );
      const assignedToUserId = assignedToMember.user._id;
      dispatch(SetLoading(true));
      
      if (task) {
        // update task
        response = await UpdateTask({
          ...values,
          project: project._id,
          assignedTo: task?.assignedTo._id,
          _id: task?._id,
        }, token);
      } else {
        const assignedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assignedTo: assignedToUserId,
          assignedBy,
        }, token);
      }

      if (response.data.success) {
        if (!task) {
          // send notification to the assigned employee
          AddNotification({
            title: `You have been assigned a new task in ${project.name}`,
            user: assignedToUserId,
            onClick: `/project/${project._id}`,
            description: values.description,
          }, token);
        }

        reloadData();
        toast.dark(response.data.message);
        setShowTaskForm(false);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };

  const validateEmail = () => {
    const employeesInProject = project.members.filter(
      (member) => member.role === "employee"
    );
    const isEmailValid = employeesInProject.find(
      (employee) => employee.user.email === email
    );
    return isEmailValid ? true : false;
  };

  const uploadImage = async () => {
    try {
      dispatch(SetLoading(true));
      const url = await upload(file);
      const body = {"taskId": task?._id, "file": url}
      console.log(body);
      const response = await UploadImage(body, token);
      if (response.data.status) {
        toast.success(response.data.message);
        setImages([...images, response.data]);
        reloadData();
      } else {
        throw new Error(response.data.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(SetLoading(true));
      const attachments = images.filter((img) => img !== image);
      const response = await UpdateTask({
        ...task,
        attachments,
      }, token);
      if (response.data.success) {
        toast.dark(response.data.message);
        setImages(attachments);
        reloadData();
      } else {
        throw new Error(response.data.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      toast.dark(error.data.message);
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      title={task ? "UPDATE TASK" : "CREATE TASK"}
      open={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      centered
      onOk={() => {
        formRef.current.submit();
      }}
      okText={task ? "UPDATE" : "CREATE"}
      width={800}
      footer={selectedTab.toString() === "2" ? null : undefined}
    >
      <Tabs activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
        <Tabs.TabPane tab="Task Details" key="1">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{
              ...task,
              assignedTo: task ? task?.assignedTo.email : "",
            }}
          >
            <Form.Item label="Task Name" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Task Description" name="description">
              <TextArea />
            </Form.Item>

            <Form.Item label="Assign To" name="assignedTo">
              <Input
                placeholder="Enter email of the employee"
                onChange={(e) => setEmail(e.target.value)}
                disabled={task ? true : false}
              />
            </Form.Item>

            {email && !validateEmail() && (
              <div className="bg-red-700 text-sm p-2 rounded">
                <span className="text-white">
                  Email is not valid or employee is not in the project
                </span>
              </div>
            )}
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Attachments" key="2" disabled={!task}>
          <div className="flex" style={{flexDirection: "column"}}>
              {task?.attachments.map((attachment) => {
                <img src={attachment} />
              })}
          </div>
          <div className="flex gap-5 mb-5">
            {images.map((image) => {
              return (
                <div className="flex gap-3 p-2 border border-solid rounded border-gray-500 items-end">
                  <img
                    src={image}
                    alt=""
                    className="w-20 h-20 object-cover mt-2"
                  />
                  <i
                    className="ri-delete-bin-line"
                    onClick={() => deleteImage(image)}
                  ></i>
                </div>
              );
            })}
          </div>
          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              setFile(info.file);
            }}
            listType="picture"
          >
            <Button type="dashed" style={{padding: "4rem", margin: "2rem"}}>Upload Images</Button>
          </Upload>
            
          <div className="flex mt-4 gap-5" style={{justifyContent: "flex-end", marginTop: "1rem", gap: "2rem"}}>
            <Button type="default" onClick={() => setShowTaskForm(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={uploadImage} disabled={!file}>
              Upload
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default TaskForm;
