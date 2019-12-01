import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import { IProfile } from "../models/profile";
import agent from "../api/agent";
import { thisExpression } from "@babel/types";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      var profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      })
    }
  }
}
