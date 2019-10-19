import React, { useContext } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'

const ActivityDetails : React.FC = () => {
    const activitiesStore = useContext(ActivityStore);
    const {selectedActivity: activity, enableEditMode, disableEditMode, selectActivity} = activitiesStore;
    return (
        <Card fluid> 
            <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity!.title}</Card.Header>
                <Card.Meta>
                    <span>{activity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity!.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color="blue" content="Edit" onClick={() => enableEditMode()} />
                    <Button basic color="grey" content="Cancel" 
                            onClick={() => { disableEditMode(); selectActivity(""); } } />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivityDetails)