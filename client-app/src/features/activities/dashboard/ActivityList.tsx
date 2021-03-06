import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { IActivity } from "../../../app/models/activity";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { format } from "date-fns";

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate: activities } = rootStore.activityStore;
  return (
    <Fragment>
      {activities.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="green">
            {format(group, "eeee do MMMM")}
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
