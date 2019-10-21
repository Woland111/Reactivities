import React, { SyntheticEvent, useContext } from 'react'
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

const ActivityList: React.FC = () => {

    const activityStore = useContext(ActivityStore);
    const {activitiesByDate: activities, deleteActivity, submitting} = activityStore;
    return (
        <Segment clearing>
            <Item.Group divided>
                {activities.map((activity) => {
                    return (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as='a'>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>    
                                    <Button as={Link} to={`/activities/${activity.id}`} 
                                            content="View" color="blue" floated="right" />
                                    <Button name={activity.id} 
                                            loading={activityStore.target === activity.id && submitting} 
                                            onClick={(e: SyntheticEvent<HTMLButtonElement>) => deleteActivity(e, activity.id)} 
                                            content="Delete" color="red" floated="right" />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                            </Item>
                    )
                })}
                

            </Item.Group>

        </Segment>
        
    )
}

export default observer(ActivityList)