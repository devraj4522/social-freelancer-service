import { Fragment, useCallback, useEffect, useState } from "react";
import { Feed, Segment, Divider, Container } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import Spinner from "@/components/Layout/Spinner";
import useApiRequest from "@/components/hooks/useApiRequest";
import { NoNotifications } from "@/components/Layout/NoData";
import TNotifcation from "@/components/WorkManagementTool/TNotification";


function Notifications({ user }) {
  return (
    <TNotifcation user={user} />
  );
}

export default Notifications;
