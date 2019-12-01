import React, { useContext, useState } from "react";
import { Card, Header, Tab, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoUploadWidget from "../../app/common/photoUploadWidget/PhotoUploadWidget";

export const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(true);
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBotton: 0 }}>
          <Header icon="image" floated="left">
            Photos
          </Header>
          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget />
          ) : (
            <Card.Group>
              {profile &&
                profile.photos.map(photo => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button basic positive content="Main" />
                        <Button basic negative icon="trash" />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};
