import React, { useContext } from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;

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
        <Header as="h2" inverted content="Welcome to Reactivities" />
        {!isLoggedIn && (
          <Button as={Link} to="/login" size="huge" inverted>
            Login
          </Button>
        )}
        {isLoggedIn && (
          <Button as={Link} to="/activities" size="huge" inverted content="Activities" />
        )}
      </Container>
    </Segment>
  );
};

export default HomePage;
