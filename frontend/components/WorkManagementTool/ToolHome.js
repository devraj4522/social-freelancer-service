import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";
// import Divider from "../../components/Divider";
import { getDateFormat } from "@/utils/helper";
import { GetProjectsByRole } from "@/tools_apicalls/projects";
import cookie from "js-cookie";
import { Divider, Grid, Header, Segment } from "semantic-ui-react";
import Link from "next/link";
import { toast } from "react-toastify";

function ToolHome({user}) {
  const [projects, setProjects] = useState([]);
  const dispatch = useDispatch();
  const token = cookie.get("token");

  const truncateWords = (text, limit) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + ' ...';
    }
    return text;
  };

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole(user._id, token);
      dispatch(SetLoading(false));
      if (response.status === 200) {
        console.log(response.data.data);
        setProjects(response.data.data);
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(projects);
  return (
    <div className="tool-home">
      <h1>
        Heyy {user?.name}!
      </h1>
     <h2>Welcome to WORK-TRACKER! Your Work Management Tool</h2>
     <h3 className="text-primary text xl">Here you can create projects, assign tasks to your team members and track their progress</h3>
      <Grid columns={3} stackable style={{marginTop: "2rem"}}>
        {projects.map((project) => (
          <Grid.Column key={project._id}>
          <Link href={`/tool/${project._id}`}>
            <Segment
                className="border border-solid border-gray-400 rounded-md p-2 cursor-pointer single-project"
                
            >
                <Header as="h3" className="text-primary text-lg uppercase font-semibold">
                {truncateWords(project.name, 50)}
                </Header>

                <Divider className="h-[1px] bg-gray-400 my-2" />

                <div className="flex justify-between">
                <span className="text-gray-600 text-sm font-semibold">
                    Created At
                </span>
                <span>
                    {getDateFormat(project.createdAt)}
                </span>
                </div>
                <div className="flex justify-between" >
                <span className="text-gray-600 text-sm font-semibold">Owner</span>
                <span className="text-gray-600 text-sm">
                    {project.owner.name}
                </span>
                </div>
                <div className="flex justify-between">
                <span className="text-gray-600 text-sm font-semibold">
                    Status
                </span>
                <span className="text-gray-600 text-sm uppercase">
                    {project.status}
                </span>
                </div>
            </Segment>
          </Link>
        </Grid.Column>
      ))}
    </Grid>

      {projects.length === 0 && (
        <div className="flex">
          <p className="text-primary text-xl">
               You have no projects yet
          </p>
        </div>
      )}
    </div>
  );
}

export default ToolHome;
