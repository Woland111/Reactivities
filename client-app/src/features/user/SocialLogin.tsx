import React from "react";
import { Button, Icon } from "semantic-ui-react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { render } from "react-dom";
import { observer } from "mobx-react-lite";

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLogin: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <FacebookLogin
      appId="641953273222448"
      fields="name, email, picture"
      callback={fbCallback}
      render={(renderProps: any) => (
        <Button loading={loading} type="button" color="facebook" onClick={renderProps.onClick} fluid>
          <Icon name="facebook" />
          Login
        </Button>
      )}
    />
  );
};

export default observer(SocialLogin)