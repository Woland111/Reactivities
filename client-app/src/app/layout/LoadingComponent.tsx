import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const LoadingComponent: React.FC<{ inverted?: boolean, content?: string }> = 
    ({ inverted = true, content }) => {
    return (
        <Dimmer inverted={inverted} active >
            <Loader content={content} />>
        </Dimmer>
    )
}

export default LoadingComponent