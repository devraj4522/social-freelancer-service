import ToolHome from "@/components/WorkManagementTool/ToolHome";
import store from "@/redux/store";
import { ConfigProvider, theme } from "antd";

import { Provider } from "react-redux";

const Index = ({ user }) => {
    return (<>

   
        <ToolHome user={user} />
        </>
        );
};

export default Index;