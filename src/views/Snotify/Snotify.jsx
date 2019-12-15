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


//functions
import Firebase from "fbConfig/fbConfig";


class Snotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        to: '',
        body: ''
      },
      submitting: false,
      error: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }
  notificationAlert = React.createRef();
  onSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true });
    const sendSMS = Firebase.functions().httpsCallable('sendSMS');
    sendSMS({ to: this.state.message.to, body: this.state.message.body })
    .then(() => {
      this.setState({
        error: false,
        submitting: false,
        message: {
          to: '',
          body: ''
        }
      });
      this.notificationAlert.current.notificationAlert({
        place: 'bc',
        message: (
          <p>Your message has been send successfully</p>
        ),
        type: "success",
        icon: "now-ui-icons ui-1_check",
        autoDismiss: 5
      });
    })
    .catch(() => {
      this.setState({
        error: true,
        submitting: false
      });
    });
  }
  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      message: { ...this.state.message, [name]: event.target.value }
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
              <h2 className="title">Snotify</h2>
              <p className="category">
                A beautiful component to help you send SMS messages to your customers
              </p>
            </div>
          }
        />
        <div className="content">
          {this.state.alert}
          <Row>
            <Col xs={12} md={5} className="ml-auto mr-auto">
              <Card className="card-calendar">
                <CardBody>
                  <form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <Label>Phone Number: </Label>
                      <Input
                        type="tel"
                        name="to"
                        id="to"
                        placeholder="Recipient Phone Number"
                        value={this.state.message.to}
                        onChange={this.onHandleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Message: </Label>
                      <Input
                        type="textarea"
                        name="body"
                        id="body"
                        placeholder="Type here your SMS message..."
                        value={this.state.message.body}
                        onChange={this.onHandleChange}
                      />
                    </FormGroup>
                    <Button disabled={this.state.submitting} style={{ width: 100 }} color="info" type="submit" className="mt-3">
                      Send
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={this.state.error} toggle={this.toggleModal}>
          <ModalHeader className="justify-content-center" toggle={this.toggleModal}>
            Error while sending the message
          </ModalHeader>
          <ModalBody>
            Something is wrong with your inputs... Check again!
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

export default Snotify;
