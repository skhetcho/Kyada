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

// routes.js is the file we need to add the routes for the sidemenu items. The items will be rendered under
// Admin.jsx when calling Sidebar 

import Dashboard from "views/Dashboard/Dashboard.jsx";
// import LoginPage from "views/Pages/LoginPage.jsx";
import Snotify from "views/Snotify/Snotify.jsx";
import Couponizer from "views/Couponizer/Couponizer.jsx";
import Help from "views/Help/Help.jsx";


let routes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "now-ui-icons design_app",
  //   component: Dashboard,
  //   layout: "/admin"
  // },
  {
    path: "/snotify",
    name: "Snotify",
    icon: "now-ui-icons ui-2_chat-round",
    component: Snotify,
    layout: "/admin"
  },
  {
    path: "/help",
    name: "Help",
    icon: "now-ui-icons objects_support-17",
    component: Help,
    layout: "/admin"
  },
  // {
  //   path: "/couponizer",
  //   name: "Couponizer",
  //   icon: "now-ui-icons shopping_tag-content",
  //   component: Couponizer,
  //   layout: "/admin"
  // }
];

export default routes;
