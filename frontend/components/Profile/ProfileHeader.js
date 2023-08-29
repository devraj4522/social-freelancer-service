import React, { useState } from "react";
import { Segment, Grid, Divider, Header, Button, List } from "semantic-ui-react";
import Avatar from "../Post/Avatar";
import { followUser, unfollowUser } from "../../utils/profileActions";

function ProfileHeader({
  profile,
  ownAccount,
  loggedUserFollowStats,
  setUserFollowStats
}) {
  const [loading, setLoading] = useState(false);

  const isFollowing = loggedUserFollowStats.following.some(
    following => following.user === profile.user._id
  );

  return (
    <>
      <Segment style={{'background': 'rgb(14, 25, 36)',
      'border': '2px solid #3795BD',
      'borderRadius': '22px',
      'paddingTop': '30px',
      'paddingLeft': '30px',
      'color': '#fefeff'}}>
        <Grid stackable >
          <Grid.Column width={11}>
            <Grid.Row>
              <Header
                as="h2"
                content={profile.user.name}
                style={{ marginBottom: "5px", color: "#fefeff" }}
              />
            </Grid.Row>

            <Grid.Row stretched >
              {profile.bio}
              <Divider hidden />
            </Grid.Row>

            <Grid.Row>
              {profile.social ? (
                <List>
                  <List.Item>
                    <List.Icon name="mail" />
                    <List.Content content={profile.user.email} />
                  </List.Item>

                  {profile.social.facebook && (
                    <List.Item>
                      <List.Icon name="facebook" color="blue" />
                      <List.Content
                        content={profile.social.facebook}
                      />
                    </List.Item>
                  )}

                  {profile.social.instagram && (
                    <List.Item>
                      <List.Icon name="instagram" color="red" />
                      <List.Content
                        content={profile.social.instagram}
                      />
                    </List.Item>
                  )}

                  {profile.social.youtube && (
                    <List.Item>
                      <List.Icon name="youtube" color="red" />
                      <List.Content
                        content={profile.social.youtube}
                      />
                    </List.Item>
                  )}

                  {profile.social.twitter && (
                    <List.Item>
                      <List.Icon name="twitter" color="blue" />
                      <List.Content
                        content={profile.social.twitter}
                      />
                    </List.Item>
                  )}
                </List>
              ) : (
                <>No Social Media Links </>
              )}
            </Grid.Row>
          </Grid.Column>

          <Grid.Column width={5} stretched style={{ textAlign: "center" }}>
            <Grid.Row >
              <Avatar
                styles={{ height: "250px", width: "250px", borderRadius: "50%" }}
                alt={profile.user.name}
                src={profile.user.profilePicUrl}
              />
            </Grid.Row>
            <br />

            {!ownAccount && (
              <Button
                style={{ marginTop: "15px"}}
                compact
                loading={loading}
                disabled={loading}
                content={isFollowing ? "Following" : "Follow"}
                icon={isFollowing ? "check circle" : "add user"}
                color={isFollowing ? "instagram" : "twitter"}
                onClick={async () => {
                  setLoading(true);
                  isFollowing
                    ? await unfollowUser(profile.user._id, setUserFollowStats)
                    : await followUser(profile.user._id, setUserFollowStats);
                  setLoading(false);
                }}
              />
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

export default ProfileHeader;
