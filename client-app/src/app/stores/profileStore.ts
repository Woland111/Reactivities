import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed, reaction } from "mobx";
import { IProfile, IPhoto } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { thisExpression } from "@babel/types";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          this.loadFollowings(activeTab === 3 ? 'followers': 'following')
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      var profile = await agent.Profiles.get(username);
      console.log(profile);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.profile.image = photo.url;
            this.rootStore.userStore.user.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo.");
    } finally {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainImage = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainImage(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(p => p.isMain)!.isMain = false;
        this.profile!.photos.find(p => p.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem setting main photo.");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.delete(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          p => p.id !== photo.id
        );
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem deleting a photo.");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem updating profile.");
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Following.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followingCount++;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem following.");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Following.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followingCount--;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem following.");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Following.listFollowings(
        this.profile!.username.toLowerCase(),
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
      });
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
