import React, { useContext, useState } from "react";
import { Card, Header, Tab, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoUploadWidget from "../../app/common/photoUploadWidget/PhotoUploadWidget";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, uploadPhoto, uploadingPhoto, loading, setMainImage, deletePhoto } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(true);

  const handleUploadImage = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  }

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
            <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={uploadingPhoto} />
          ) : (
            <Card.Group>
              {profile &&
                profile.photos.map(photo => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button basic loading={loading} positive content="Main" onClick={() => setMainImage(photo)} />
                        <Button basic negative icon="trash" onClick={() => deletePhoto(photo.id)} />
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

export default observer(ProfilePhotos)