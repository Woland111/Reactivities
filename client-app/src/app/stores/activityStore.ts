import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable target: string = "";
  @observable activitiesRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | undefined;
  @observable submitting = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activitiesRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
    const obj = sortedActivities.reduce(
      (activities, activity) => {
        const date = activity.date.split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      },
      {} as { [key: string]: IActivity[] }
    );
    console.log(obj);
    return Object.entries(obj);
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activitiesRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
      console.log(this.groupActivitiesByDate(activities));
    } catch (error) {
      console.log(error);
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          this.activity = activity;
        });
      } catch (error) {
        console.log(error);
      } finally {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  getActivity = (id: string) => {
    return this.activitiesRegistry.get(id);
  };

  @action clearActivity = () => {
    this.activity = undefined;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activitiesRegistry.set(activity.id, activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("create activity error", () => {
        this.submitting = false;
      });
    }
  };

  @action updateActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("updating activity", () => {
        this.activitiesRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("update activity error", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activitiesRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };
}

export default createContext(new ActivityStore());
