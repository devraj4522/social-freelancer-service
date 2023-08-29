import React from "react";
import { Menu } from "semantic-ui-react";

function ProfileMenuTabs({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats
}) {
  return (
    <>
      <Menu pointing secondary style={{background: "rgba(109, 135, 167, 0.9)"}}>
        <Menu.Item
          style={{color: "rgb(254, 254, 255)" }}
          name="profile"
          active={activeItem === "profile"}
          onClick={() => handleItemClick("profile")}
        />

        <Menu.Item
          name={`${followersLength} followers`}
          style={{color: "rgb(254, 254, 255)"}}
          active={activeItem === "followers"}
          onClick={() => handleItemClick("followers")}
        />

        {ownAccount ? (
          <>
            <Menu.Item
              name={`${
                loggedUserFollowStats.following.length > 0
                  ? loggedUserFollowStats.following.length
                  : 0
              } following`}
              style={{color: "rgb(254, 254, 255)"}}
              active={activeItem === "following"}
              onClick={() => handleItemClick("following")}
            />

            <Menu.Item
              name="Update Profile"
              style={{color: "rgb(254, 254, 255)"}}
              active={activeItem === "updateProfile"}
              onClick={() => handleItemClick("updateProfile")}
            />

            <Menu.Item
              name="settings"
              style={{color: "rgb(254, 254, 255)"}}
              active={activeItem === "settings"}
              onClick={() => handleItemClick("settings")}
            />
          </>
        ) : (
          <Menu.Item
            style={{color: "rgb(254, 254, 255)"}}
            name={`${followingLength} following`}
            active={activeItem === "following"}
            onClick={() => handleItemClick("following")}
          />
        )}
      </Menu>
    </>
  );
}

export default ProfileMenuTabs;
