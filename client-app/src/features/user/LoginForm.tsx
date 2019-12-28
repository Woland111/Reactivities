import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header, Divider } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { SocialLogin } from "./SocialLogin";

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, fclogin } = rootStore.userStore;
  return (
    <FinalForm
      validate={combineValidators({
        email: isRequired("email"),
        password: isRequired("password")
      })}
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(error => ({
          [FORM_ERROR]: error
        }))
      }
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Login to Reactivities"
            color="teal"
            textAlign="center"
          />
          <Field name="email" placeholder="Email" component={TextInput} />
          <Field
            name="password"
            placeholder="Password"
            component={TextInput}
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text="Invalid e-mail or password"
            />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Login"
            fluid
          />
           <Divider horizontal>OR</Divider>
           <SocialLogin fbCallback={fclogin} />
        </Form>
      )}
    />
  );
};

export default LoginForm;
