import React from 'react'
import { Tab } from 'semantic-ui-react'

const panes = [
    {menuItem: 'About', render: () => <Tab.Pane>This is about</Tab.Pane>},
    {menuItem: 'Photos', render: () => <Tab.Pane>This is photos</Tab.Pane>},
    {menuItem: 'Activities', render: () => <Tab.Pane>This is activities</Tab.Pane>},
    {menuItem: 'Followers', render: () => <Tab.Pane>This is followers</Tab.Pane>},
    {menuItem: 'Following', render: () => <Tab.Pane>This is following</Tab.Pane>}
]

export const ProfileContent = () => {
    return (
        <Tab 
            menu={{ fluid: true, vertical: true }}
            menuPosition="right"
            panes={panes}
        />
    )
}
