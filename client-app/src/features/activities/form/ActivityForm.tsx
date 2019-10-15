import React, { useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'

interface IProps {
    setInEditMode: (inEdit: boolean) => void,
    activity: IActivity | null,
    createActivity: (activity: IActivity) => void,
    updateActivity: (activity: IActivity) => void,
    submitting: boolean
}

const ActivityForm: React.FC<IProps> = 
    ({setInEditMode, activity: initialFormState, createActivity, updateActivity, submitting}) => {
    const initializeForm = () => {
        if (initialFormState) {
            return initialFormState;
        } else {
            return {
                id: "",
                title: "",
                description: "",
                category: "",
                date: "",
                city: "",
                venue: ""
            }
        }
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm());

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setActivity({...activity, [event.currentTarget.name]: event.currentTarget.value});
    }   

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        }
        else {
            updateActivity(activity);
        }
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input name="title" placeholder="Title" value={activity.title} onChange={handleInputChange} />
                <Form.TextArea rows="2" name="description" placeholder="Description" value={activity.description} onChange={handleInputChange} />
                <Form.Input name="category" placeholder="Category" value={activity.category} onChange={handleInputChange} />
                <Form.Input type="datetime-local" name="date" placeholder="Date" value={activity.date} onChange={handleInputChange} />
                <Form.Input name="city" placeholder="City" value={activity.city} onChange={handleInputChange} />
                <Form.Input name="venue" placeholder="Venue" value={activity.venue} onChange={handleInputChange} />
                <Button loading={submitting}
                        floated="right" 
                        content="Submit" 
                        type="submit" 
                        positive />
                <Button floated="right" 
                        content="Cancel" 
                        type="button" 
                        onClick={() => setInEditMode(false)} />
            </Form>
        </Segment>
    )
}

export default ActivityForm
