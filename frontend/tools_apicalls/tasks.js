import axios from "axios";
import baseUrl from "@/utils/baseUrl";

export const CreateTask = async (task, token) =>
  axios.post(`${baseUrl}/api/tool-task/create-task`, task, {headers: {Authorization: token}});

export const GetAllTasks = async (filters, token) =>
  axios.post(`${baseUrl}/api/tool-task/get-all-tasks`, filters, {headers: {Authorization: token}});

export const UpdateTask = async (task, token) =>
  axios.post(`${baseUrl}/api/tool-task/update-task`, task, {headers: {Authorization: token}});

export const DeleteTask = async (id, token) =>
  axios.post(`${baseUrl}/api/tool-task/delete-task`, { _id: id }, {headers: {Authorization: token}});

export const UploadImage = async (payload, token) => {
  return axios.post(`${baseUrl}/api/tool-task/upload-image`, payload, {headers: {Authorization: token}});
};
