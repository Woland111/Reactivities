import React from "react";
import { Form as FinalForm } from "react-final-form";

const LoginForm = () => {
    return (
        <FinalForm 
            onSubmit={values => console.log(values)}
            render={({ handleSubmit }) => (
                
            )}
        />
    )
}

export default LoginForm