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
import Login from "views/Pages/LoginPage.jsx"
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";


// core components
// import AuthNavbar from "components/Navbars/AuthNavbar.jsx";

var ps;
const random = Math.floor(Math.random() * Math.floor(17));;

class Auth extends React.Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.fullPages);
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    return (
      <>
        {/* <AuthNavbar {...this.props} /> */}
        <div className="wrapper wrapper-full-page" ref="fullPages">
          <div
            className="full-page section-image"
            filter-color={"yellow"}
          >
            <Login imageNum={random}/>
          </div>
        </div>
      </>
    );
  }
}

export default Auth;
