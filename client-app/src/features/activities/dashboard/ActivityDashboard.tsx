import React from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import ActivityList from './ActivityList'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'

interface IProps {
    activities: IActivity[],
    selectActivity: (id: string) => void,
    selectedActivity: IActivity | null,
    inEditMode: boolean,
    setInEditMode: (inEdit: boolean) => void,
    setSelectedActivity: (activity: IActivity | null) => void,
    createActivity: (activity: IActivity) => void,
    updateActivity: (activity: IActivity) => void,
    deleteActivity: (activity: IActivity) => void
}

const ActivityDashboard: React.FC<IProps> = 
    ({  activities, 
        selectActivity, 
        selectedActivity, 
        inEditMode, 
        setInEditMode,
        setSelectedActivity,
        createActivity,
        updateActivity,
        deleteActivity}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity} 
                    deleteActivity={deleteActivity} />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !inEditMode && <ActivityDetails 
                                                        activity={selectedActivity!} 
                                                        setInEditMode={setInEditMode}
                                                        setSelectedActivity={setSelectedActivity} /> }
                {inEditMode && <ActivityForm 
                                    key={(selectedActivity && selectedActivity.id) || 0}
                                    setInEditMode={setInEditMode}
                                    activity={selectedActivity} 
                                    createActivity={createActivity} 
                                    updateActivity={updateActivity} /> }
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashboard