import baseUrl from "@/utils/baseUrl";
import axios from "axios";

export const CreateProject = async (project, token) => axios.post(`${baseUrl}/api/tool-project/create-project`, project, {headers: {Authorization: token}});

export const GetAllProjects = async (filters, token) => axios.post(`${baseUrl}/api/tool-project/get-all-projects`, filters, {headers: {Authorization: token}});

export const GetProjectById = async (id, token) => axios.post(`${baseUrl}/api/tool-project/get-project-by-id`, { _id: id }, {headers: {Authorization: token}});

export const EditProject = async (project, token) => axios.post(`${baseUrl}/api/tool-project/edit-project`, project, {headers: {Authorization: token}});

export const DeleteProject = async (id, token) => axios.post(`${baseUrl}/api/tool-project/delete-project`, { _id: id }, {headers: {Authorization: token}});

export const GetProjectsByRole = async (userId, token) => axios.post(`${baseUrl}/api/tool-project/get-projects-by-role`, { userId }, {headers: {Authorization: token}});

export const AddMemberToProject = async (data, token) => axios.post(`${baseUrl}/api/tool-project/add-member`, data, {headers: {Authorization: token}});

export const RemoveMemberFromProject = async (data, token) => axios.post(`${baseUrl}/api/tool-project/remove-member`, data, {headers: {Authorization: token}});