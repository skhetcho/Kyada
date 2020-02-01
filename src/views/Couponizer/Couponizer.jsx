/*!
  Coded by Kyada
*/
/*eslint-disable*/
import React from "react";

import {
  FormGroup,
  Label,
  Input,
  FormText,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent
} from "reactstrap";

//3rd party components
import NotificationAlert from "react-notification-alert";
import ReactTables from './ReactTable';

// reactstrap components
import { Card, CardBody, Row, Col } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

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
      error: false,
      couponBuild: [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
      ],
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }
  notificationAlert = React.createRef();

  componentDidMount() {
    this.randomCoupon();
  }

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
            body: '',
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
      [name]: event.target.value,
    });
  }

  randomCoupon = () => {
    let random = "";
    for (let i = 0; i < 6; i++) {
      let item = this.state.couponBuild[Math.floor(Math.random() * this.state.couponBuild.length)];
      random += item;
    }
    this.setState({ randomCoupon: random });
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
              <h2 className="title">Couponizer</h2>
              <p className="category">
                Create and Track Coupons for Your Ad Campaigns<button
                  style={{
                    fontSize: 10,
                    backgroundColor: 'transparent',
                    border: 'solid',
                    borderWidth: 1,
                    paddingLeft: 3,
                    paddingRight: 3,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 5,
                    marginLeft: 5,
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}>?</button>
              </p>
            </div>
          }
        />
        <div className="content">
          {this.state.alert}
          <Row>
            <Col xs={12} md={6}>
              <Card>
                <CardBody>
                  <ReactTables />
                </CardBody>
              </Card>
            </Col>
            <Col xs={12} md={6} className="ml-auto mr-auto">
              <Card id="create-card">
                <CardBody>
                  <h3 style={{ color: '#9a9a9a', textAlign: 'center' }}>Create a New Coupon</h3>
                  <Nav pills className="nav-pills-info">
                    <NavItem>
                      <NavLink
                        className={this.state.hTabs === "ht1" ? "active" : ""}
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.setState({ hTabs: "ht1" })}
                      >
                        Existing Campaign
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={this.state.hTabs === "ht2" ? "active" : ""}
                        onClick={() => this.setState({ hTabs: "ht2" })}
                        style={{ cursor: 'pointer' }}
                      >
                        New Campaign
                    </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.hTabs} className="tab-space">
                    <TabPane tabId="ht1">
                      Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits.
                      <br /><br />
                      Dramatically visualize customer directed convergence without revolutionary ROI.
                    </TabPane>
                    <TabPane tabId="ht2">
                      <FormGroup>
                        <Label>New campaign name:</Label>
                        <Input
                          type="text"
                          name="campaignName"
                          id="campaignName"
                          placeholder="Enter the name of the new coupon campaign"
                          value={this.state.campaignName}
                          onChange={this.onHandleChange}
                          style={{ marginTop: 5 }}
                        />
                      </FormGroup>
                      <br /><br />
                      <Row>
                        <Col xs={12} md={8}>
                          <FormGroup>
                            <Label>Person Name:</Label>
                            <Input
                              type="text"
                              name="campaignPersonName"
                              id="campaignPersonName"
                              placeholder="Enter the name of indivigual contestant"
                              value={this.state.campaignPersonName}
                              onChange={this.onHandleChange}
                              style={{ marginTop: 5 }}
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={12} md={4}>
                          <FormGroup>
                            <Label>Autogenerated Coupon:</Label><Button onClick={this.randomCoupon} style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }} color="link"><i className={"now-ui-icons loader_refresh"}></i></Button>
                            <p style={{ marginTop: 10, fontWeight: 'bold' }}>{this.state.randomCoupon}</p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
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
