import React, { useContext, useEffect, useState } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    page,
    setPage,
    totalPages
  } = rootStore.activityStore;
  const [loadingNextActivities, setLoadingNextActivities] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const loadMoreActivities = () => {
    setLoadingNextActivities(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNextActivities(false));
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            loadMore={loadMoreActivities}
            hasMore={!loadingNextActivities && page + 1 < totalPages}
            pageStart={0}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNextActivities} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
