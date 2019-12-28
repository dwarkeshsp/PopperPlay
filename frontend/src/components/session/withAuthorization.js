import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../firebase";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push("/login");
        }
      });
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return <Component {...this.props} />;
    }
  }
  return compose(withRouter, withFirebase)(WithAuthorization);
};
export default withAuthorization;
