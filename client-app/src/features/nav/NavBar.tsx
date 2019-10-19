import React, { useContext } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import ActivitiesStore from '../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';

const NavBar: React.FC = () => {
    const activitiesStore = useContext(ActivitiesStore);
    const {selectActivity, enableEditMode} = activitiesStore;
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button positive content="Create Activity" onClick={() => { selectActivity(""); enableEditMode();}} />
                </Menu.Item>
            </Container>
      </Menu>
    )
}

export default observer(NavBar)
