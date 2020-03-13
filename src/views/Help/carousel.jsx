import React, { Component } from 'react';

import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import { Card, CardBody, Row, Col, CardImg, CardText, CardTitle } from "reactstrap";

import ZOOM from "assets/img/zoom.png";
import RINGCENTRAL from "assets/img/ringcentral.jpg";
import GATALAB from "assets/img/gatalab.jpg";



export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      apps: [
        {
          "img": "assets/img/zoom.png",
          "title": "Zoom Application",
          "description": "Zoom conferencing, meeting, VoIP phone services and more"
        },
        {
          "img": "assets/img/ringcentral.jpg",
          "title": "RingCentral Application",
          "description": "RingCentral VoIP services"
        },
        {
          "img": "assets/img/gatalab.jpg",
          "title": "Gata Labs",
          "description": "Taxi dispatch software"
        }
      ]
    }
  }
  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  render() {
    return (
      <div> 
        <Carousel
          arrowLeft={
            <button
              style={{ backgroundColor: '#2CA8FF', marginRight: 10 }}
              className="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"
            >
              <span>prev</span>
            </button>
          }
          arrowRight={
            <button
              style={{ backgroundColor: '#2CA8FF', marginLeft: 10 }}
              className="BrainhubCarousel__arrows BrainhubCarousel__arrowRight"
            >
              <span>next</span>
            </button>
          }

          addArrowClickHandler

          slidesPerPage={this.state.width <= 1680 ? (this.state.width <= 1415 ? (this.state.width <= 1175 ? (this.state.width <= 640 ? 1 : 2) : 3) : 4) : 5}
          arrows
          infinite
        >
          {
            this.state.apps.map(function (item, i) {
              return (
                <div style={{ maxWidth: 250 }}>
                  <Card style={{ maxWidth: 250 }}>
                    <CardImg top src={require(item.img)} alt="card image" />
                    <CardBody>
                      <CardTitle>{item.title}</CardTitle>
                      <CardText>{item.description}</CardText>
                    </CardBody>
                  </Card>
                </div>
              )
            })
          }
          {/* <div style={{ maxWidth: 250 }}>
            <Card style={{ maxWidth: 250 }}>
              <CardImg top src={ZOOM} alt="Card image Zoom" />
              <CardBody>
                <CardTitle>Zoom Application</CardTitle>
                <CardText>Zoom conferencing, meeting, VoIP phone services and more</CardText>
              </CardBody>
            </Card>
          </div>
          <div style={{ maxWidth: 250 }}>
            <Card style={{ maxWidth: 250 }}>
              <CardImg top src={ZOOM} alt="Card image Zoom" />
              <CardBody>
                <CardTitle>Zoom Application</CardTitle>
                <CardText>Zoom conferencing, meeting, VoIP phone services and more</CardText>
              </CardBody>
            </Card>
          </div>
          <div style={{ maxWidth: 250 }}>
            <Card style={{ maxWidth: 250 }}>
              <CardImg top src={ZOOM} alt="Card image Zoom" />
              <CardBody>
                <CardTitle>Zoom Application</CardTitle>
                <CardText>Zoom conferencing, meeting, VoIP phone services and more</CardText>
              </CardBody>
            </Card>
          </div> */}
        </Carousel>
      </div >
    );
  }
}