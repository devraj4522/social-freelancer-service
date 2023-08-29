import baseUrl from "@/utils/baseUrl";
import axios from "axios";

export const AddNotification = async (notification, token) => axios.post(`${baseUrl}/api/tool-notification/add-notification`, notification, {headers: {Authorization: token}});

export const GetAllNotifications = async (token) => (await axios.get(`${baseUrl}/api/tool-notification/get-all-notifications`, {headers: {Authorization: token}}));

export const MarkNotificationAsRead = async (id, token) => axios.post(`${baseUrl}/api/tool-notification/mark-as-read`, null, {headers: {Authorization: token}});

export const DeleteAllNotifications = async (token) => axios.delete(`${baseUrl}/api/tool-notification/delete-all-notifications`, {headers: {Authorization: token}});    