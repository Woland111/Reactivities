import React from "react";
import { IAttendee } from "../../../app/models/activity";
import { List, Image, Popup } from "semantic-ui-react";

const ActivityListItemAttendees: React.FC<{ attendees: IAttendee[] }> = ({
  attendees
}) => {
  const styles = {
    borderColor: 'orange',
    borderWidth: 2
  }
  return (
    <List horizontal>
      {attendees.map(a => (
        <List.Item key={a.username}>
          <Popup
            header={a.username}
            trigger={
              <Image size="mini" circular src={a.image || "assets/user.png"} bordered style={a.following ? styles : null }/>
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
