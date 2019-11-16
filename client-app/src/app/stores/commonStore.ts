import { RootStore } from "./rootStore";
import { observable, action, computed, reaction } from "mobx";

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
        () => this.token,
        token => {
            if (token) {
                window.localStorage.setItem("jwt", token);
            } else {
                window.localStorage.removeItem("jwt");
            }
        }
    )
  }

  @observable token: string | null = null;
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    this.token = token;
  };
  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
