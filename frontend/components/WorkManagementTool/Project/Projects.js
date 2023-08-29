import { Button, Table } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProject, GetAllProjects } from "@/tools_apicalls/projects";
import { SetLoading } from "@/redux/loadersSlice";
import { getDateFormat } from "@/utils/helper";
import cookie from "js-cookie";
import ProjectForm from "./ProjectForm";
import { toast } from "react-toastify";

function Projects({user}) {
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const dispatch = useDispatch();
  const token = cookie.get("token");
  console.log(projects);
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllProjects({ owner: user._id }, token);
      if (response.status === 200) {
        console.log(response.data.data);
        setProjects(response.data.data);
      } else {
        throw new Error(response.data);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      toast.dark(error.message);
      dispatch(SetLoading(false));
    }
  };

  const onDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteProject(id, token);
      if (response.status === 200) {
        toast.dark(response.data.message);
        getData();
      } else {
        throw new Error(response.data.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      toast.dark(error.message);
      dispatch(SetLoading(false));
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-4" style={{gap: "1rem"}}>
            <i className="ri-delete-bin-line" 
              style={{cursor: "pointer", opacity: "0.8"}}
              onClick={() => onDelete(record._id)}
            ></i>
            <i
              className="ri-pencil-line"
              style={{cursor: "pointer", opacity: "0.8"}}
              onClick={() => {
                setSelectedProject(record);
                setShow(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex justify-start">
        <Button
          style={{marginTop: "1rem", marginBottom: "1rem"}}
          type="default"
          onClick={() => {
            setSelectedProject(null);
            setShow(true);
          }}
        >
          Add Project
        </Button>
      </div>
      <Table columns={columns} dataSource={projects} className="mt-4" rowKey="_id" />
      {show && (
        <ProjectForm
          show={show}
          setShow={setShow}
          reloadData={getData}
          project={selectedProject}
          user={user}
        />
      )}
    </div>
  );
}

export default Projects;
