/*!
  Coded by Kyada
*/
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Card, Row, Col} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

class Help extends React.Component {
  render() {
    return (
      <div>
        <PanelHeader
          content={
            <div className="header text-center">
              <h2 className="title">Help</h2>
              <p className="category">
                All of what you need in one place<button style={{ fontSize: 10, backgroundColor: 'transparent', border: 'solid', borderWidth: 1, paddingLeft: 3, paddingRight: 3, borderColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, marginLeft: 5, color: 'rgba(255, 255, 255, 0.5)' }}>?</button>
              </p>
            </div>
          }
        />
        <div style={{ height: 1207 }} className="content">
          <Row>
            <Col xs={12} md={11} className="ml-auto mr-auto">
              <Card style={{ width: '100%', height: '100vh'}}>
                <iframe
                  style={{ border: 0, width: '100%', height: '100%'}}
                  src="https://view.monday.com/embed/491437063-7f16c2ff7e70f8915877b8a89d8aaeaf"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Help;
