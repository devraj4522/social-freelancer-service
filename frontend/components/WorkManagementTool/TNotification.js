import { Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { DeleteAllNotifications, GetAllNotifications, MarkNotificationAsRead } from "@/tools_apicalls/notifications";
import { SetLoading } from "@/redux/loadersSlice";
import { SetNotifications } from "@/redux/usersSlice";
import { toast } from "react-toastify";
import cookie from "js-cookie";
import { Button } from "semantic-ui-react";

function TNotifcation({ user }) {
  const token = cookie.get("token");
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const getNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications(token);
      dispatch(SetLoading(false));
      if (response.status === 200) {
        // get the notifications that are not read
        const tempnotifications = response.data.data.filter(data=> data.read === false)
        setNotifications(tempnotifications);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      toast.dark(error.message);
    }
  };


  
  useEffect(() => {
    getNotifications();
  }, []);


  const readNotifications = async () => {
    try {
      const response = await MarkNotificationAsRead(null, token);
      if (response.status === 200) {
        console.log(response.data.data);
        dispatch(SetNotifications(response.data.data));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteAllNotifications(token);
      dispatch(SetLoading(false));
      if (response.status === 200) {
        dispatch(SetNotifications([]));
        toast.dark(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      toast.error(error.message);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  useEffect(() => {
    if (notifications.length > 0) {
      readNotifications();
    }
  }, [notifications]);

  return (
    < >
    <div className="flex flex-col gap-5 mt-5">
        {notifications.length > 0 ? (
          <div className="flex justify-end">
            <Button 
              style={{color: "#fff", marginBottom: "10px"}}
              className="text-[15px] underline cursor-pointer"
              onClick={deleteAllNotifications}
            >
              Delete All
            </Button>
          </div>
        )
        : (
          <div className="flex justify-center">
            <span className="text-[15px]">No Notifications</span>
          </div>
        )
      }

      </div>
    <Table columns={columns} dataSource={notifications} className="mt-5" rowKey="_id" />
    </>
  );
}

export default TNotifcation;
