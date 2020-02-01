/*
  Coded by Kyada
*/
import React, { Component } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Pagination from "./Pagination";
import data from "./data";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


// reactstrap components
import {
  Button
} from "reactstrap";

const dataTable = data;

class ReactTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: dataTable.map((prop, key) => {
        return {
          id: key,
          campaign: prop[0],
          name: prop[1],
          coupon: prop[2],
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              {/* use this button to add a like kind of action */}
              <Button
                onClick={() => {
                  let obj = this.state.data.find(o => o.id === key);
                  this.setState({
                    pressedCampaign: obj.campaign,
                    pressedName: obj.name,
                    pressedCoupon: obj.coupon
                  }, () => {
                    this.setState({ error: true })
                  })
                }}
                className="btn-icon btn-round"
                color="info"
                size="sm"
              >
                <i className="fas fa-eye" />
              </Button>{" "}
              {/* use this button to add an edit kind of action */}
              {/* commented out component for the purpose of current uselessness */}
              {/* <Button
                onClick={() => {
                  let obj = this.state.data.find(o => o.id === key);
                  alert(
                    "You've clicked EDIT button on \n{ \nCampaign: " +
                    obj.campaign +
                    ", \nname: " +
                    obj.name +
                    ", \ncoupon: " +
                    obj.coupon +
                    "\n}."
                  );
                }}
                className="btn-icon btn-round"
                color="warning"
                size="sm"
              >
                <i className="fa fa-edit" />
              </Button>{" "} */}
              {/* use this button to remove the data row */}
              <Button
                onClick={() => {
                  var data = this.state.data;
                  data.find((o, i) => {
                    if (o.id === key) {
                      // here you should add some custom code so you can delete the data
                      // from this component and from your server as well
                      data.splice(i, 1);
                      console.log(data);
                      return true;
                    }
                    return false;
                  });
                  this.setState({ data: data });
                }}
                className="btn-icon btn-round"
                color="danger"
                size="sm"
              >
                <i className="fa fa-times" />
              </Button>{" "}
            </div>
          )
        };
      }),
      error: false,
      pressedName: "",
      pressedCoupon: "",
      pressedCampaign: ""
    };
  }
  filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
        true
    );
  }
  toggleModal = () => {
    this.setState({
      error: !this.state.error
    });
  }
  render() {
    return (
      <>
        <ReactTable
          data={this.state.data}
          PaginationComponent={Pagination}
          filterable
          defaultFilterMethod={(filter, row) => this.filterCaseInsensitive(filter, row)}
          columns={[
            {
              Header: "Campaign",
              accessor: "campaign"
            },
            {
              Header: "Name",
              accessor: "name"
            },
            {
              Header: "Coupon",
              accessor: "coupon"
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false
            }
          ]}
          defaultPageSize={10}
          showPaginationTop={false}
          showPaginationBottom={true}
          className="-striped -highlight"
        />
        <Modal isOpen={this.state.error} toggle={this.toggleModal}>
          <ModalHeader className="justify-content-center" toggle={this.toggleModal}>
            Showing Info
          </ModalHeader>
          <ModalBody>
            Campaign: {this.state.pressedCampaign}<br /><br />
            Name: {this.state.pressedName}<br /><br />
            Coupon Code: {this.state.pressedCoupon}<br />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggleModal}>
              Retrieve
            </Button>
            <Button color="secondary" onClick={this.toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default ReactTables;
