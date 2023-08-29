import { useRouter } from "next/router";
const { default: ProjectInfo } = require("@/components/WorkManagementTool/ProjectInfo/ProjectInfo");

const Tool = ({user}) => {
    const router = useRouter();
    const { tool } = router.query;

    return (<>
        <ProjectInfo user={user} projectId={tool}/>
        </>
        );
}

export default Tool;