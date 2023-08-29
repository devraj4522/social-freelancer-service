import { useCallback, useEffect, useState } from "react";
import { Icon, Grid } from "semantic-ui-react";
import { useRouter } from "next/router";
import { logoutUser } from "../../utils/authUser";
import { GetAllNotifications } from "@/tools_apicalls/notifications";
import cookie from "js-cookie";
import { toast } from "react-toastify";

const MenuRow = ({ menuName, href, iconName, active = false, children, ...props }) => {
  const router = useRouter();
  const isActive = useCallback(() => {
    return router.pathname === href || active;
  }, [router, active, href]);

  // prettier-ignore
  const push = useCallback(e => {
    e.preventDefault();
    router.push(e.currentTarget.href);
  }, [router]);

  const common = { as: "a", onClick: push, href, ...props };

  return (
    <Grid.Row {...common} className={`menuRow ${isActive() ? "active" : ""}`}>
      <Grid.Column>
        {children}
        <Icon name={iconName} size="large" {...(isActive() && { color: "teal" })} />
      </Grid.Column>

      {menuName ? <Grid.Column only="computer">{menuName}</Grid.Column> : <></>}
    </Grid.Row>
  );
};

function SideMenu({ user: { unreadNotification, email, unreadMessage, username, isSeller } }) {
  const router = useRouter();
  const [hasReadToolNotification, setHasReadToolNotification] = useState(false);

  const navigation = router.pathname.split("/")[1];
  const token = cookie.get("token");

  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications(token);
      if (response.status === 200) {
        const datas = response.data.data;
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].hasOwnProperty('read') && datas[i].read === false) {
            setHasReadToolNotification(true);
          }
        }
        setHasReadToolNotification(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.dark(error.message);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="stickyCol">
      <Grid>
      {(navigation !== "freelance" && navigation !== "tool") && <>
        <MenuRow href="/" menuName="Home" iconName="home" />
        <MenuRow only="mobile tablet" iconName="search" href="/search" />

        <MenuRow iconName="mail outline" menuName="Messages" href="/messages">
          {unreadMessage ? <div className="menuIconBadge" /> : <></>}
        </MenuRow>

        <MenuRow
          menuName="Notifications"
          iconName="bell outline"
          href="/notifications"
        >
          {unreadNotification ? <div className="menuIconBadge" /> : <></>}
        </MenuRow>
      </>}
      {(navigation === "freelance") && 
        <>
          <MenuRow href="/freelance" menuName="Home" iconName="home" />
          {isSeller && 
          <>
            <MenuRow href="/freelance/gig/add" menuName="Add Gig"  style={{whiteSpace: "nowrap"}} iconName="plus" />
            <MenuRow href="/freelance/gig/mygigs" menuName="My Gigs"  style={{whiteSpace: "nowrap"}} iconName="file" />
           </>
          }
          <MenuRow href="/freelance/orders" menuName="Orders" iconName="shopping bag" />
          <MenuRow href="/freelance/messages" menuName="Messages" iconName="mail outline" />
          
      
        </>
        }
        {(navigation === "tool") && 
        <>
          <MenuRow href="/tool" menuName="Home" iconName="home" />
          <MenuRow href="/tool/toolProjects" menuName="My Projects" style={{whiteSpace: "nowrap"}} iconName="folder outline" />

          <MenuRow
          menuName="Notifications"
          iconName="bell outline"
          href="/tool/notifications"
        >
          {hasReadToolNotification && <div className="menuIconBadge" /> }
        </MenuRow>
        </>
        }
        <MenuRow
          menuName="Account"
          iconName="user"
          href={`/${username}`}
          active={router.query.username === username}
        />

        <MenuRow
          style={{ cursor: "pointer" }}
          menuName="Logout"
          iconName="log out"
          onClick={() => logoutUser(email)}
        />
      </Grid>
    </div>
  );
}

export default SideMenu;
