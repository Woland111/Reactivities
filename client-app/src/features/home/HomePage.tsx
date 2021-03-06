import React, { useContext, Fragment } from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";

const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
  const token = window.localStorage.getItem('jwt');

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {isLoggedIn && user && token ? (
          <Fragment>
            <Header
              as="h2"
              inverted
              content={`Welcome to Reactivities ${user.displayName}`}
            />
            <Button
              as={Link}
              to="/activities"
              size="huge"
              inverted
              content="Activities"
            />
          </Fragment>
        ) : (
          <Fragment>
            <Header as="h2" inverted content="Welcome to Reactivities" />
            <Button size="huge" content="Login" inverted onClick={() => openModal(<LoginForm />)} />
            <Button size="huge" content="Register" inverted onClick={() => openModal(<RegisterForm />)} />
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default HomePage;
