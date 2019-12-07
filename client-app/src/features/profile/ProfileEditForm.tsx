import React from "react";
import { IProfile } from "../../app/models/profile";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";

interface IProps {
  updateProfile: (profile: IProfile) => void;
  profile: IProfile;
}

const ProfileEditForm: React.FC<IProps> = ({ updateProfile, profile }) => {
  const validate = combineValidators({ displayName: isRequired('displayName') });
  return (
    <FinalForm
      validate={validate}
      onSubmit={updateProfile}
      initialValues={profile!}
      render={({ handleSubmit, pristine, invalid, submitting }) => (
        <Form onSubmit={handleSubmit} error>
            <Field name='displayName' component={TextInput} placeholder='Display Name' value={profile!.displayName} />
            <Field name='bio' component={TextAreaInput} rows={3} placeholder='Bio' value={profile!.bio} />
            <Button content='Update' disabled={pristine || invalid} floated='right' loading={submitting} positive />
        </Form>
      )}
    />
  );
};

export default ProfileEditForm;
