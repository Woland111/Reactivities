import React, { FC } from 'react'
import { AxiosResponse } from 'axios'
import { Message } from 'semantic-ui-react'

interface IProps {
    error: AxiosResponse;
    text: string;
}

const ErrorMessage: FC<IProps> = ({error, text}) => {
    return (
        <Message color="red">
            <Message.Header>{error.statusText}</Message.Header>
            {text && (<Message.Content>
                {text}
            </Message.Content>)}
        </Message>
    )
}

export default ErrorMessage