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
import { Container } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid}>
          <nav>
            <ul>
              <li>
                <a
                  href="https://tecotaxi.com/"
                  className="mr-4-px"
                  target="_blank"
                >
                  Zappy
                </a>
              </li>
              <li>
                <a
                  href="https://tecotaxi.com/about/"
                  className="mr-4-px"
                  target="_blank"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://tecotaxi.com/services/"
                  target="_blank"
                >
                  Services
                </a>
              </li>
            </ul>
          </nav>
          <div className="copyright">
            &copy; {1900 + new Date().getYear()}
            {/* , Designed by{" "}
            <a href="https://www.invisionapp.com" target="_blank">
              Invision
            </a>
            . Coded by{" "}
            <a
              href="https://www.creative-tim.com?ref=nudr-footer"
              target="_blank"
            >
              Creative Tim
            </a>
            . */}
          </div>
        </Container>
      </footer>
    );
  }
}

Footer.defaultProps = {
  default: false,
  fluid: false
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
