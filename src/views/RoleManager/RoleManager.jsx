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
/*eslint-disable*/
import React from "react";

import {
  FormGroup,
  Label,
  Input,
  FormText,
  Button
} from "reactstrap";

//3rd party components
import NotificationAlert from "react-notification-alert";


// reactstrap components
import { Card, CardBody, Row, Col } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";


//fbConfig
import Firebase from "fbConfig/fbConfig";


class RoleManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      newUserEmail: "",
      newUserPassword: "",
      submitting: false,
      submittingUserProfileCreate: false,
      error: false,
      errorUserNotFound: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }
  notificationAlert = React.createRef();
  onSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true })
    const addUserAsAdmin = Firebase.functions().httpsCallable('addUserAsAdmin');
    addUserAsAdmin({ email: this.state.email })
      .then((res) => {
        if (res !== Object) {
          this.setState({ submitting: false, errorUserNotFound: true }, () => {
            this.toggleModal();
          })
        }
      })
      .catch(() => {
        this.setState({ error: true })
      })
  }
  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      [name]: event.target.value
    });
  }
  toggleModal = () => {
    this.setState({
      error: !this.state.error
    });
  }
  render() {
    return (
      <>
        <NotificationAlert ref={this.notificationAlert} />
        <PanelHeader
          content={
            <div className="header text-center">
              <h2 className="title">Role Manager</h2>
              <p className="category">
                Manage Platform Users, Add Admins and Delegate With Ease
              </p>
            </div>
          }
        />
        <div className="content">
          <Row>
            <Col xs={12} md={5} className="ml-auto mr-auto">
              <Card className="card-calendar">
                <CardBody>
                  <form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <Label>Make Admins: </Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter the email of a user to make them an admin..."
                        value={this.state.email}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 5 }}
                      />
                    </FormGroup>
                    <Button disabled={this.state.submittingUserProfileCreate} style={{ width: 103, marginTop: 10 }} color="info" type="submit" className="mt-3">
                      Empower
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 100 }}>
            <Col xs={12} md={5} className="ml-auto mr-auto">
              <Card className="card-calendar">
                <CardBody>
                  <form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <Label>Register New Users:</Label>
                      <Input
                        type="email"
                        name="newUserEmail"
                        id="newUserEmail"
                        placeholder="New User Email..."
                        value={this.state.newUserEmail}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 5 }}
                      />
                      <Input
                        type="password"
                        name="newUserPassword"
                        id="newUserPassword"
                        placeholder="New User Password"
                        value={this.state.newUserPassword}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 5 }}
                      />
                    </FormGroup>
                    <Button disabled={this.state.submittingUserProfileCreate} style={{ width: 100 }} color="info" type="submit" className="mt-3">
                      Create
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={this.state.error} toggle={this.toggleModal}>
          <ModalHeader className="justify-content-center" toggle={this.toggleModal}>
            {this.state.errorUserNotFound ? "Finding Issue" : "Error while sending the message"}
          </ModalHeader>
          <ModalBody>
            {this.state.errorUserNotFound ? "This email doesn't seem to belong to any of your users, are you sure you registered them first?" : "Something went wrong with the requst. Reach out to us for assistance"}
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

export default RoleManager;
