import React from "react";
import { Button, Icon } from "semantic-ui-react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { render } from "react-dom";

interface IProps {
  fbCallback: (response: any) => void;
}

export const SocialLogin: React.FC<IProps> = ({ fbCallback }) => {
  return (
    <FacebookLogin
      appId=""
      fields="name, email, picture"
      callback={fbCallback}
      render={(renderProps: any) => (
        <Button type="button" color="facebook" onClick={renderProps.onClick} fluid>
          <Icon name="facebook" />
          Login
        </Button>
      )}
    />
  );
};
