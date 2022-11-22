import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Auth } from "aws-amplify";

function Logout(props) {
  const { setAdmin, setLogin } = props;
  const navigate = useNavigate();
  const redirectPage = () => {
    navigate("/");
  };
  async function signOut() {
    await Auth.signOut();
    setAdmin(false);
    setLogin(false);
    redirectPage();
  }
  //   return (<div>
  //     {signOut}
  //   </div>);
  signOut();
  return ;
}

export default Logout;
