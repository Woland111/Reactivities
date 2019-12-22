import React, { Fragment, useContext } from "react";
import { Menu, Header } from "semantic-ui-react";
import { Calendar } from "react-widgets";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { setPredicate, predicate } = rootStore.activityStore;
  return (
    <Fragment>
      <Menu vertical size={"large"} style={{ width: "100%", marginTop: 50 }}>
        <Header icon={"filter"} attached color={"teal"} content={"Filters"} />
        <Menu.Item
          onClick={() => setPredicate("all", "true")}
          active={predicate.size === 0}
          color={"blue"}
          name={"all"}
          content={"All Activities"}
        />
        <Menu.Item
          onClick={() => setPredicate("isGoing", "true")}
          active={predicate.has("isGoing")}
          color={"blue"}
          name={"username"}
          content={"I'm Going"}
        />
        <Menu.Item
          onClick={() => setPredicate("isHost", "true")}
          active={predicate.has("isHost")}
          color={"blue"}
          name={"host"}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={"calendar"}
        attached
        color={"teal"}
        content={"Select Date"}
      />
      <Calendar
        onChange={date => setPredicate("startDate", date!)}
        value={predicate.get("startDate") || new Date()}
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
