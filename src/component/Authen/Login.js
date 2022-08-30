import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react'
import axios from 'axios';
import config from '../../config'

function Login(props) {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const {setNavbar, setAdmin} = props;
    const navigate = useNavigate();
    useEffect(() => {
        setNavbar(true);
      }, []);

    const redirectPage = () => {
        navigate('/');
    }

    async function handlerLogin(e){
        if ( !email || !password){
            alert('Enter email and password')
            return;
        }
        try{
            const response = await axios({
                method: 'post',
                url: `${config.APP_API_URL}/login`,
                data:{
                    username: email,
                    password: password
                }
    
            })
    
            const status = response.status;
            if (status === 200)
            {
                setNavbar(false)
                //if ( email === config.ADMIN_ACCOUNT){
                    setAdmin(true)
                //}
                redirectPage();
            }
            else
            {
                alert("Login fail!")
            }
        }catch{
            alert("Login fail!")
        }
        
    }
    return(
        <div className="container pt-5">
            <div className="d-flex justify-content-center">
                <div className="col-md-7">
                    <h2>FCJ Book Store - Login</h2>
                    <div action="/action_page.php">
                        <div className="mb-3 mt-3">
                        <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" 
                                onChange={(e) => setEmail( e.target.value )} value={email}/>
                        </div>
                        <div className="mb-3">
                        <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd"
                                onChange={(e) => setPassword( e.target.value )} value={password}/>
                        </div>
                        <div className="form-check mb-3">
                        <label className="form-check-label">
                            <input className="form-check-input" type="checkbox" name="remember"/> Remember me
                        </label>
                        </div>
                        <button className="btn btn-primary" onClick={handlerLogin}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login