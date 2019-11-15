import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Label } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
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
        <Form onSubmit={handleSubmit}>
          <Field name="email" placeholder="Email" component={TextInput} />
          <Field
            name="password"
            placeholder="Password"
            component={TextInput}
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <Label content={submitError.statusText} color="red" basic />
          )}
          <br />
          <Button
            disabled={ (invalid && !dirtySinceLastSubmit) || pristine }
            loading={submitting}
            positive
            content="Login"
          />
          <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
        </Form>
      )}
    />
  );
};

export default LoginForm;
