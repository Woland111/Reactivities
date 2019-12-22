import { observable, action, computed, runInAction, reaction, toJS } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/form/util/util";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from "@microsoft/signalr";

const LIMIT = 2;

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activitiesRegistry.clear();
        this.loadActivities();
      }
    );
  }

  @observable target: string = "";
  @observable activitiesRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable loading: boolean = false;
  @observable activity: IActivity | undefined;
  @observable submitting = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable page = 0;
  @observable activityCount = 0;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate != "all") {
      this.predicate.set(predicate, value);
    }
  };

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state!))
      .then(() => {
        console.log("Attempting to join group");
        this.hubConnection!.invoke("AddToGroup", activityId);
      })
      .catch(error =>
        console.log("Error establishing connection to SignalR: ", error)
      );
    this.hubConnection.on("ReceiveComment", comment => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });
    this.hubConnection!.on("Send", message => {
      console.log(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id).then(
      () => {
        this.hubConnection!.stop();
      }
    );
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
      toast.error("Problem adding comment.");
    }
  };

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
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction("loading activities", () => {
        this.activityCount = activityCount;
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
      return toJS(activity);
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          setActivityProps(activity, user);
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments = [];
      activity.isHost = true;
      runInAction("creating activity", () => {
        this.activitiesRegistry.set(activity.id, activity);
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.log(error);
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

  @action attendActivity = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        const user = this.rootStore.userStore.user;
        const attendee = createAttendee(user!);
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activitiesRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      toast.error("Problem when attending activity");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.notattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activitiesRegistry.set(this.activity.id, this.activity);
        }
      });
    } catch (error) {
      toast.error("Problem when cancelling attendance");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
