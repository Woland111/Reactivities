import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity"
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [target, setTarget] = useState("");

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setInEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setInEditMode(true);
  }

  const handleCreateActivity = (newActivity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(newActivity).then(() => {
      setActivities([...activities, newActivity]);
      setSelectedActivity(newActivity);
      setInEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleUpdateActivity = (changedActivity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(changedActivity).then(() => {
      setActivities([...activities.filter(a => a.id !== changedActivity.id), changedActivity]);
      setSelectedActivity(changedActivity);
      setInEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, activity: IActivity) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(activity.id).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id)]);
    }).then(() => setSubmitting(false));
  }

  useEffect(() => {
    agent.Activities.list().then(activities => {
      let updatedActivities: IActivity[] = activities.map((activity) => {
        activity.date = activity.date.split(".")[0];
        return activity;
      });
      setActivities(updatedActivities);
    }).then(() => setLoading(false))
  }, []);

  if (loading) return <LoadingComponent content="Loading activities..." />

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
            deleteActivity={handleDeleteActivity}
            submitting={submitting} 
            target={target}></ActivityDashboard>
        </Container>
    </Fragment>
  );
}

export default App;
