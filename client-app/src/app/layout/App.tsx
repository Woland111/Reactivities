import React, { useState, useEffect, Fragment } from 'react';
import { Container } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../models/activity"
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [inEditMode, setInEditMode] = useState<boolean>(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setInEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setInEditMode(true);
  }

  const handleCreateActivity = (newActivity: IActivity) => {
    setActivities([...activities, newActivity]);
    setSelectedActivity(newActivity);
    setInEditMode(false);
  }

  const handleUpdateActivity = (changedActivity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== changedActivity.id), changedActivity]);
    setSelectedActivity(changedActivity);
    setInEditMode(false);
  }

  const handleDeleteActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id)]);
  }

  useEffect(() => {
    axios.get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        let activities: IActivity[] = response.data.map(activity => {
          activity.date = activity.date.split(".")[0];
          return activity;
        });
        setActivities(activities);
      })
  }, []);

  return (
    <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm} />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard 
            activities={activities} 
            selectActivity={handleSelectActivity} 
            selectedActivity={selectedActivity} 
            inEditMode={inEditMode} 
            setInEditMode={setInEditMode} 
            setSelectedActivity={setSelectedActivity} 
            createActivity={handleCreateActivity} 
            updateActivity={handleUpdateActivity} 
            deleteActivity={handleDeleteActivity}></ActivityDashboard>
        </Container>
    </Fragment>
  );
}

export default App;
