import {observable, action, computed, configure, runInAction} from 'mobx'
import { createContext, SyntheticEvent } from 'react'
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: "always"});

class ActivityStore {
    @observable target: string = "";
    @observable activitiesRegistry = new Map();
    @observable loadingInitial: boolean = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;

    @computed get activitiesByDate() {
        return Array.from(this.activitiesRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction("loading activities", () => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activitiesRegistry.set(activity.id, activity);
                });   
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            runInAction("load activities error", () => {
                this.loadingInitial = false;
            });
        } 
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activitiesRegistry.get(id);
        this.editMode = false;
    }

    @action enableEditMode = () => {
        this.editMode = true;
    }

    @action disableEditMode = () => {
        this.editMode = false;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction("creating activity", () => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.disableEditMode();
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction("create activity error", () => {
                this.submitting = false;
            });
        }    
    }

    @action updateActivity  = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction("updating activity", () => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.disableEditMode();
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction("update activity error", () => {
                this.submitting = false;
            });
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
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
    }
}

export default createContext(new ActivityStore())