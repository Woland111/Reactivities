import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { IActivity } from "../../../app/models/activity";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate: activities } = activityStore;
  return (
    <Fragment>
      {activities.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="green">
            {group}
          </Label>
            <Item.Group divided>
              {activities.map((activity: IActivity) => {
                return (
                  <ActivityListItem key={activity.id} activity={activity} />
                );
              })}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
