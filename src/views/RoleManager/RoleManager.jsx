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
/*
notes:
remove userData function from firebase functions
remove the debugging button for calling user data
add form validation error messages
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

      newUserName: "",
      newUserEmail: "",
      newUserPassword: "",
      newUserConfirmPassword: "",

      submittingMakeAdmin: false,
      submittingUserProfileCreate: false,

      error: false,
      errorUserNotFound: false,

      modalTitle: "Error adding new admin",
      modalDesc: "",

    };
    this.onSubmitMakeAdmin = this.onSubmitMakeAdmin.bind(this);
    this.onSubmitUserProfileCreate = this.onSubmitUserProfileCreate.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }
  notificationAlert = React.createRef();
  onSubmitMakeAdmin(event) {
    event.preventDefault();
    this.setState({ submittingMakeAdmin: true })
    const addUserAsAdmin = Firebase.functions().httpsCallable('addUserAsAdmin');
    addUserAsAdmin({ email: this.state.email })
      .then((data) => {
        if (data.data.code === 0 || data.data.code === 1) {
          this.setState({
            email: "",
            submittingMakeAdmin: false,
            modalDesc: data.data.message
          }, () => {
            this.toggleModal();
          })
        }
        else {
          this.notificationAlert.current.notificationAlert({
            //place bc: Is not british columbia haha, it means bottom corner. Notice where
            //the notification shows
            place: 'bc',
            message: (
              <p>{this.state.email} has been granted admin privilages!</p>
            ),
            type: "success",
            icon: "now-ui-icons ui-1_check",
            autoDismiss: 5
          });
          this.setState({
            email: "",
            submittingMakeAdmin: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ submittingMakeAdmin: false });
      })
  }
  onSubmitUserProfileCreate(event) {
    event.preventDefault();
    this.setState({ submittingUserProfileCreate: true })
    const addUserAsEmployee = Firebase.functions().httpsCallable('addUserAsEmployee');
    /////
    //the company name is hardcoded, fix it for later use and scalability
    /////
    addUserAsEmployee({ company: "tecotaxi", name: this.state.newUserName, email: this.state.newUserEmail, password: this.state.newUserPassword })
      .then((data) => {
        if (data.data.code === 0 || data.data.code === 1 || data.data.code === 2) {
          this.setState({
            newUserName: "",
            newUserEmail: "",
            newUserPassword: "",
            newUserConfirmPassword: "",
            submittingUserProfileCreate: false,
            modalTitle: "Error adding user account",
            modalDesc: data.data.message
          }, () => {
            this.toggleModal();
          })
        }
        else {
          this.notificationAlert.current.notificationAlert({
            //place bc: Is not british columbia haha, it means bottom corner. Notice where
            //the notification shows
            place: 'bc',
            message: (
              <p>{this.state.newUserEmail} has been added as a user in your company</p>
            ),
            type: "success",
            icon: "now-ui-icons ui-1_check",
            autoDismiss: 5
          });
          this.setState({
            newUserName: "",
            newUserEmail: "",
            newUserPassword: "",
            newUserConfirmPassword: "",
            submittingUserProfileCreate: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ submittingUserProfileCreate: false });
      })
  }
  checkUserData() {
    event.preventDefault();
    const userData = Firebase.functions().httpsCallable('userData');
    userData({ user: "souren@openauto.ca" })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error)
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
                Manage Platform Users, Add Admins and Delegate With Ease<button style={{ fontSize: 10, backgroundColor: 'transparent', border: 'solid', borderWidth: 1, paddingLeft: 3, paddingRight: 3, borderColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, marginLeft: 5, color: 'rgba(255, 255, 255, 0.5)' }}>?</button>
              </p>
            </div>
          }
        />
        <div className="content">
          <Row>
            <Col xs={12} md={5} className="ml-auto mr-auto">
              <Card className="card-calendar">
                <CardBody>
                  <form onSubmit={this.onSubmitUserProfileCreate}>
                    <FormGroup>
                      <Label>Register a New User:</Label>
                      <Input
                        type="text"
                        name="newUserName"
                        id="newUserName"
                        placeholder="Name"
                        value={this.state.newUserName}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 5 }}
                      />
                      <Input
                        type="email"
                        name="newUserEmail"
                        id="newUserEmail"
                        placeholder="User Email..."
                        value={this.state.newUserEmail}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 7 }}
                      />
                      {//add condition
                        1 == 0 ? <FormText color="danger" style={{ marginLeft: 10 }}>
                          We'll never share your email with anyone else.
                      </FormText> : <></>}
                      <Input
                        type="password"
                        name="newUserPassword"
                        id="newUserPassword"
                        placeholder="User Password"
                        value={this.state.newUserPassword}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 7 }}
                      />
                      <Input
                        type="password"
                        name="newUserConfirmPassword"
                        id="newUserConfirmPassword"
                        placeholder="Confirm Password"
                        value={this.state.newUserConfirmPassword}
                        onChange={this.onHandleChange}
                        style={{ marginTop: 7 }}
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
          <Row style={{ marginTop: 100 }}>
            <Col xs={12} md={5} className="ml-auto mr-auto">
              <Card className="card-calendar">
                <CardBody>
                  <form onSubmit={this.onSubmitMakeAdmin}>
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
                    <Button disabled={this.state.submittingMakeAdmin} style={{ width: 103, marginTop: 10 }} color="info" type="submit" className="mt-3">
                      Empower
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Button style={{ width: 103, marginTop: 10 }} color="info" onClick={() => this.checkUserData()} className="mt-3">
            checkUserData
          </Button>
        </div>
        <Modal isOpen={this.state.error} toggle={this.toggleModal}>
          <ModalHeader className="justify-content-center" toggle={this.toggleModal}>
            {this.state.modalTitle}
          </ModalHeader>
          <ModalBody>
            {this.state.modalDesc}
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
