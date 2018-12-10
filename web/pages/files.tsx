import React, { Component } from "react";
import withAuth from "../lib/withAuth";
import ReactFilestack from "filestack-react";

class Files extends Component {
  render() {
    return (
      <div>
        Files
        <ReactFilestack
          apikey="AzFPnNv2wSTW4x5E7LEPVz"
          buttonText="Click me"
          buttonClass="classname"
          onSuccess={() => console.log("wooo!")}
        />
      </div>
    );
  }
}

export default withAuth(Files);
