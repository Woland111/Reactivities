import React, { SyntheticEvent } from 'react'
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    activities: IActivity[],
    selectActivity: (id: string) => void,
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, activity: IActivity) => void,
    submitting: boolean,
    target: string
}

const ActivityList: React.FC<IProps> = ({activities, selectActivity, deleteActivity, submitting, target}) => {

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
                                    <Button onClick={() => {selectActivity(activity.id)}} 
                                            content="View" color="blue" floated="right" />
                                    <Button name={activity.id} loading={target === activity.id && submitting} onClick={(e: SyntheticEvent<HTMLButtonElement>) => deleteActivity(e, activity)} 
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

export default ActivityList