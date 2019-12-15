// /*!

// =========================================================
// * Now UI Dashboard PRO React - v1.3.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/now-ui-dashboard-pro-react
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import React, { useCallback, useContext, useEffect } from "react";
import { withRouter, Redirect } from "react-router";
import Firebase from "fbConfig/fbConfig";
import bgImage from "views/Pages/images";
import { AuthContext } from "layouts/MotherAuth";
import Loader from 'react-loader-spinner'


// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from "reactstrap";

// core components
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as Sentry from '@sentry/browser';
import nowLogo from "assets/img/now-logo.png";


const Login = ({ history, ...props }) => {

  useEffect(() => {
    //componendDidMount section
    return () => {
      //componentWillUnmount section
    }
  }, []);

  const [passwordFocus, setPasswordFocus] = React.useState(false);
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLogging, setIsLogging] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isUserAuthenticatedButNotAuthorized, setIsUserAuthenticatedButNotAuthorized] = React.useState(false)


  const { currentUser } = useContext(AuthContext);

  const handleLogin = async () => {
    if (email <= 0 || password <= 0) {
      toggleModal();
    }
    else {
      try {
        setIsLogging(true)
        await Firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            if (currentUser !== true) {
              setIsUserAuthenticatedButNotAuthorized(true)
              setIsModalOpen(true)
              setIsLogging(false)
            }
          })
          .catch((error) => {
            setIsLogging(false)
            setPassword("");
            setEmail("");
            setIsModalOpen(true);
            Sentry.withScope((scope) => {
              scope.setExtras(
                {
                  "email": email,
                }
              );
              Sentry.captureException(error);
            });
          })
      } catch (error) {
        setIsLogging(false);
        setPassword("");
        setEmail("");
        console.log("outside catch" + error)
      }
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  if (currentUser) {
    return <Redirect to="/" />;
  }
  else {
    return (
      <>
        <div className="content">
          <div className="login-page">
            <Container>
              <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
                <Form>
                  <Card className="card-login card-plain">
                    <CardHeader>
                      <div className="logo-container">
                        <img src={nowLogo} alt="now-logo" />
                      </div>
                    </CardHeader>
                    <CardBody>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (emailFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons users_circle-08" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email..."
                          onFocus={e => setEmailFocus(true)}
                          onBlur={e => setEmailFocus(false)}
                          name="email"
                          id="email"
                          value={email}
                          onChange={e => setEmail(`${e.target.value}`)}
                        />
                      </InputGroup>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (passwordFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons objects_key-25" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password..."
                          onFocus={e => setPasswordFocus(true)}
                          onBlur={e => setPasswordFocus(false)}
                          name="password"
                          id="password"
                          value={password}
                          onChange={e => setPassword(`${e.target.value}`)}
                        />
                      </InputGroup>
                    </CardBody>
                    <CardFooter>
                      <Button
                        block
                        color="info"
                        size="lg"
                        className="mb-3 btn-round"
                        onClick={handleLogin}
                      >
                        {isLogging ?
                          <Loader
                            type="TailSpin"
                            color="#FFFFFF"
                            height={15}
                            width={15}
                          /> : "Login"}
                      </Button>
                    </CardFooter>
                  </Card>
                </Form>
              </Col>
            </Container>
          </div>
        </div>
        <div
          className="full-page-background"
          style={{ backgroundImage: "url(" + bgImage[props.imageNum] + ")" }}
        />
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader className="justify-content-center" toggle={toggleModal}>
            Error while sending the message
            </ModalHeader>
          <ModalBody>
            {isUserAuthenticatedButNotAuthorized ? "You are not authorized to view this page" : "Something is wrong with your request... Try again or contact your admin"}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
};

export default withRouter(Login);