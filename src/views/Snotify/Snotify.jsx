/*!
  Coded by Kyada
*/
/*eslint-disable*/
import React from "react";


//3rd party components
import NotificationAlert from "react-notification-alert";

// reactstrap components
import { Card, CardBody, Row, Col } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormGroup, Label, Input, Button } from "reactstrap";


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
        name: '',
        cabNum: '',
      },
      selectedOption: null,
      submitting: false,
      error: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }
  notificationAlert = React.createRef();

  userDatalist() {
    const userData = Firebase.functions().httpsCallable('userData');
    userData({user: "rakesh@troisinfotech.ca"});
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true });
    const sendSMS = Firebase.functions().httpsCallable('sendSMS');
    sendSMS({ to: this.state.message.to, name: this.state.message.name, cabNum: this.state.message.cabNum, bodyType: this.state.selectedOption })
      .then(() => {

        this.setState({
          error: false,
          submitting: false,
          message: {
            to: '',
            name: '',
            cabNum: '',
          }
        });
        this.notificationAlert.current.notificationAlert({
          //place bc: Is not british columbia haha, it means bottom corner. Notice where
          //the notification shows
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
  onHandleOptionChange(event) {
    this.setState({
      selectedOption: event.target.value
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
                A beautiful component to help you send SMS messages to your customers<button style={{ fontSize: 10, backgroundColor: 'transparent', border: 'solid', borderWidth: 1, paddingLeft: 3, paddingRight: 3, borderColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, marginLeft: 5, color: 'rgba(255, 255, 255, 0.5)' }}>?</button>
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
                      <Label>Name: </Label>
                      <Input
                        type="tel"
                        name="name"
                        id="name"
                        placeholder="Recipient Name"
                        value={this.state.message.name}
                        onChange={this.onHandleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Cab #: </Label>
                      <Input
                        type="tel"
                        name="cabNum"
                        id="cabNum"
                        placeholder="Recipient assigned cab number"
                        value={this.state.message.cabNum}
                        onChange={this.onHandleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>* Phone Number: </Label>
                      <Input
                        type="tel"
                        name="to"
                        id="to"
                        placeholder="Recipient Phone Number"
                        value={this.state.message.to}
                        onChange={this.onHandleChange}
                      />
                    </FormGroup>
                    <FormGroup check className="form-check-radio">
                      <Label>* Message: </Label>
                      <br />
                      <Label check>
                        <Input
                          defaultValue="1"
                          id="Radios"
                          name="Radios"
                          type="radio"
                          onChange={(event) => this.onHandleOptionChange(event)}
                        />
                        10 Min<span className="form-check-sign" />
                      </Label>
                      <br />
                      <Label check>
                        <Input
                          defaultValue="2"
                          id="Radios"
                          name="Radios"
                          type="radio"
                          onChange={(event) => this.onHandleOptionChange(event)}
                        />
                        5 Min<span className="form-check-sign" />
                      </Label>
                      <br />
                      <Label check>
                        <Input
                          defaultValue="3"
                          id="Radios"
                          name="Radios"
                          type="radio"
                          onChange={(event) => this.onHandleOptionChange(event)}
                        />
                        Almost there<span className="form-check-sign" />
                      </Label>
                      {/* <Input
                        type="textarea"
                        name="body"
                        id="body"
                        placeholder="Type here your SMS message..."
                        value={this.state.message.body}
                        onChange={this.onHandleChange}
                      /> */}
                    </FormGroup>
                    <Button disabled={this.state.submitting} style={{ width: 100 }} color="info" type="submit" className="mt-3">
                      Send
                    </Button>
                  </form>
                  <Button style={{ width: 100 }} color="info" onClick={() => this.userDatalist()} className="mt-3">
                      zzz
                    </Button>
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
