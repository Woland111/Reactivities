import React, { useContext, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { Grid } from "semantic-ui-react";
import { ProfileContent } from "./ProfileContent";
import { RouteComponentProps } from "react-router";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface RootParams {
  username: string;
}

interface IProps extends RouteComponentProps<RootParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, loadingProfile, profile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  if (loadingProfile) return <LoadingComponent content="Loading profile" />

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
