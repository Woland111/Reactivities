import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

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
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const obj = sortedActivities.reduce((activities, activity) => {
      const date = activity.date.toISOString().split("T")[0];
      activities[date] = activities[date]
        ? [...activities[date], activity]
        : [activity];
      return activities;
    }, {} as { [key: string]: IActivity[] });
    return Object.entries(obj);
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    const user = this.rootStore.userStore.user!;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = new Date(activity.date);
          activity.isGoing = activity.attendees.some(
            a => a.username === user.username
          );
          activity.isHost = activity.attendees.some(
            a => a.username === user.username && a.isHost
          );
          this.activitiesRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    const user = this.rootStore.userStore.user!;
    let activity: IActivity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          activity.date = new Date(activity.date);
          activity.isGoing = activity.attendees.some(a => a.username === user.username);
          activity.isHost  = activity.attendees.some(a => a.username === user.username && a.isHost);
          this.activity = activity;
          this.activitiesRegistry.set(activity.id, activity);
        });
        return activity;
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
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      toast.error("Problem submitting data.");
      console.log(error.response);
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
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      toast.error("Problem submitting data.");
      console.log(error.response);
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
