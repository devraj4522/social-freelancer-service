import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllTasks } from "@/tools_apicalls/tasks";
import { Divider } from "semantic-ui-react";
import { SetLoading } from "@/redux/loadersSlice";
import { getDateFormat } from "@/utils/helper";
import { GetProjectById } from "@/tools_apicalls/projects";
import cookie from "js-cookie";
import { toast } from "react-toastify";
import Tasks from "./Tasks";
import Members from "./Members";

function ProjectInfo({user, projectId}) {
 
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const token = cookie.get("token");

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectById(projectId, token);
      dispatch(SetLoading(false));
      if (response.status === 200) {
        setProject(response.data.data);
        const currentUser = response.data.data.members.find(
          (member) => member.user._id === user._id
        );
        setCurrentUserRole(currentUser.role);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };



  useEffect(() => {
    getData();
   
  }, []);

  return (
    project && (
      <div className="projectInfo">
        <div className="header">
          <div className="title">
            <h1 className="text-primary text-2xl font-semibold uppercase">
              {project?.name}
            </h1>
            <p className="text-gray-600 text-sm">
              {project?.description}
            </p>
            <div className="flex" style={{gap: 5}}>
              <span className="text-gray-600 text-sm font-semibold">Role</span>
              <span className="text-gray-600 text-sm uppercase">
                {currentUserRole}
              </span>
            </div>
          </div>
          <div>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold">
                Created At
              </span>
              <span className="text-gray-600 text-sm">
                {getDateFormat(project.createdAt)}
              </span>
            </div>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold">
                Created By
              </span>
              <span className="text-gray-600 text-sm">
                {project.owner.firstName} {project.owner.lastName}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tasks" key="1">
            <Tasks project={project} user={user}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Members" key="2">
            <Members project={project} reloadData={getData} user={user} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
}

export default ProjectInfo;
