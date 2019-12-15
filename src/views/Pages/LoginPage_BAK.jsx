/*!

=========================================================
* Now UI Dashboard PRO React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

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

//functions
import Firebase from "../../fbConfig/fbConfig.js";
import { signInWithEmailAndPassword } from "../../functions/functions.js";

import nowLogo from "assets/img/now-logo.png";
import bgImage from "./images";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creds: {
        email: "",
        password: ""
      },
      modalError: false,
      randNum: null
    };
    this.onHandleChange = this.onHandleChange.bind(this);
  }
  componentDidMount() {
    document.body.classList.add("login-page");
    this.randomImagePicker();
  }
  componentWillUnmount() {
    document.body.classList.remove("login-page");
  }
  randomImagePicker() {
    const random = Math.floor(Math.random() * Math.floor(17));
    this.setState({ randNum: random })
  }

  signIn() {
    // console.log(this.state.creds.email, this.state.creds.password)
    if (this.state.creds.email === "" || this.state.creds.password === "") {
      this.toggleModal();
    }
    else {
      let returnValue = signInWithEmailAndPassword(this.state.creds.email, this.state.creds.password);
      console.log(returnValue);
      if (returnValue && (returnValue[0] === 4 || returnValue[0] === 5)) {
        this.setState({
          creds: {
            email: "",
            password: ""
          },
        })
      }
      else if (returnValue && returnValue[0] === 5) {
        this.toggleModal();
      }
    }
  }

  toggleModal = () => {
    this.setState({
      modalError: !this.state.modalError
    });
  }

  checkUserstate() {
    Firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user)
        // User is signed in.
      } else {
        console.log("no users are signed in")
      }
    });
  }

  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      creds: { ...this.state.creds, [name]: event.target.value }
    });
  }
  render() {
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
                          (this.state.emailFocus ? "input-group-focus" : "")
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
                          onFocus={e => this.setState({ emailFocus: true })}
                          onBlur={e => this.setState({ emailFocus: false })}
                          name="email"
                          id="email"
                          value={this.state.creds.email}
                          onChange={this.onHandleChange}
                        />
                      </InputGroup>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (this.state.passwordFocus ? "input-group-focus" : "")
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
                          onFocus={e => this.setState({ passwordFocus: true })}
                          onBlur={e => this.setState({ passwordFocus: false })}
                          name="password"
                          id="password"
                          value={this.state.creds.password}
                          onChange={this.onHandleChange}
                        />
                      </InputGroup>
                    </CardBody>
                    <CardFooter>
                      <Button
                        block
                        color="info"
                        size="lg"
                        href="#signingin"
                        className="mb-3 btn-round"
                        onClick={() => this.signIn()}
                      >
                        Login
                      </Button>
                      <Button
                        block
                        color="info"
                        size="lg"
                        href="#signingin"
                        className="mb-3 btn-round"
                        onClick={() => this.checkUserstate()}
                      >
                        Check user state
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
          style={{ backgroundImage: "url(" + bgImage[this.state.randNum] + ")" }}
        />
        <Modal isOpen={this.state.modalError} toggle={this.toggleModal}>
          <ModalHeader className="justify-content-center" toggle={this.toggleModal}>
            Error while sending the message
          </ModalHeader>
          <ModalBody>
            {this.state.creds.email === "" || this.state.creds.password === "" ? "Email or password fields are empty, check again your entries" : "Something is wrong with your request... Try again or contact your admin"}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default LoginPage;
