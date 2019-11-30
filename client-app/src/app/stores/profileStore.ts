import { RootStore } from "./rootStore";
import { observable, runInAction, action } from "mobx";
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
