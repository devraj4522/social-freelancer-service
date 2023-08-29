import { Button, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTask, GetAllTasks, UpdateTask } from "@/tools_apicalls/tasks";
import { getDateFormat } from "@/utils/helper";
import { Divider } from "semantic-ui-react";
import { AddNotification } from "@/tools_apicalls/notifications";
import TaskForm from "./TaskForm";
import { SetLoading } from "@/redux/loadersSlice";
import cookie from "js-cookie";
import { toast } from "react-toastify";

function Tasks({ project, user }) {
  const [filters, setFilters] = useState({
    status: "all",
    assignedTo: "all",
    assignedBy: "all",
  });
  const [showViewTask, setShowViewTask] = React.useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [task, setTask] = React.useState(null);
  const dispatch = useDispatch();
  const isEmployee = project.members.find(
    (member) => member.role === "employee" && member.user._id === user._id
  );

  const token = cookie.get("token");

  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({
        project: project._id,
        ...filters,
      }, token);
      dispatch(SetLoading(false));
      if (response.status === 200) {
        setTasks(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };

  const deleteTaks = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteTask(id, token);
      if (response.data.success) {
        getTasks();
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

  const onStatusUpdate = async ({ task, status }) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateTask({
        _id: task?._id,
        status,
      }, token);
      if (response.data.success) {
        getTasks();
        toast.dark(response.data.message);
        AddNotification({
          title: "Task Status Updated",
          description: `${task?.name} status has been updated to ${status}`,
          user: task?.assignedBy?._id,
          onClick: `/project/${project._id}`,
        }, token);
      } else {
        throw new Error(response.data.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
        style={{cursor: "pointer", color: "#1890ff", textDecoration: "underline"}}
          className="underline text-[14px] cursor-pointer"
          onClick={() => {
            setTask(record);
            setShowViewTask(true);
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (text, record) =>
        record.assignedTo.username 
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      key: "assignedBy",
      render: (text, record) =>
        record.assignedBy.username,
    },
    {
      title: "Assigned On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => getDateFormat(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <select
            value={record.status}
            onChange={(e) => {
              onStatusUpdate({
                task: record,
                status: e.target.value,
              });
            }}
            disabled={record.assignedTo._id !== user._id && isEmployee}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2" style={{gap: "1rem"}}>
            <Button
              type="primary"
              onClick={() => {
                setTask(record);
                setShowTaskForm(true);
              }}
            >
              Edit
            </Button>

            <Button
              type="primary"
              danger
              onClick={() => {
                deleteTaks(record._id);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (isEmployee) {
    columns.pop();
  }

  useEffect(() => {
    getTasks();
  }, [filters]);
  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-end" style={{marginBottom: "2rem", marginTop: "2rem"}}>
          <Button type="default" onClick={() => setShowTaskForm(true)}>
            Add Task
          </Button>
        </div>
      )}

      <div className="flex" style={{gap: 5, justifyContent: "space-between", marginBottom: ".5rem"}}>
        <div>
          <span>Status </span>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({
                ...filters,
                status: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <span>Assigned By </span>
          <select
            value={filters.assignedBy}
            onChange={(e) => {
              setFilters({
                ...filters,
                assignedBy: e.target.value,
              });
            }}
          >
            <option value="all">All </option>
            {project.members
              .filter((m) => m.role === "admin" || m.role === "owner")
              .map((m) => (
                <option value={m.user._id}>
                  {m.user.username}
                </option>
              ))}
          </select>
        </div>

        <div>
          <span>Assigned To </span>
          <select
            value={filters.assignedTo}
            onChange={(e) => {
              setFilters({
                ...filters,
                assignedTo: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            {project.members
              .filter((m) => m.role === "employee")
              .map((m) => (
                <option value={m.user._id}>
                  {m.user.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <Table columns={columns} dataSource={tasks} className="mt-5" rowKey="_id" />

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={task}
          user={user}
        />
      )}

      {showViewTask && (
        <Modal
          title="TASK DETAILS"
          open={showViewTask}
          onCancel={() => setShowViewTask(false)}
          centered
          footer={null}
          width={700}
        >
          <Divider />
          <div className="flex flex-col">
            <span className="text-md text-primary font-semibold">
              {task?.name}
            </span>
            <span className="text-[14px] text-gray-500">
              {task?.description}
            </span>

            <div className="flex" style={{gap: 4}}>
              {task?.attachments.map((image) => {
                console.log(task?.attachments);
                return (
                  <img
                    src={image}
                    style={{
                      width: "100%",
                      "marginTop": "1rem",
                      "borderRadius": "0.5rem"
                    }}    
                    alt=""
                    className="w-40 h-40 object-cover mt-2 p-2 border border-solid rounded border-gray-500"
                  />
                );
              })}
            </div> 
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Tasks;
