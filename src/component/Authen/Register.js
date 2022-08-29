import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react'
import axios from 'axios';
import config from '../../config'

function Register(props) {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [code, setCode] = React.useState("")
    const [isRegister, setIsRegister] = React.useState(false)
    const {setNavbar} = props
    const navigate = useNavigate();
    useEffect(() => {
        setNavbar(true);
      }, []);

    const redirectPage = () => {
        navigate('/login');
    }

    async function handlerRegister(e){
        e.preventDefault();

        const uppercaseRegExp   = /(?=.*?[A-Z])/;
        const lowercaseRegExp   = /(?=.*?[a-z])/;
        const digitsRegExp      = /(?=.*?[0-9])/;
        const minLengthRegExp   = /.{8,}/;
        const passwordLength =      password.length;
        const uppercasePassword =   uppercaseRegExp.test(password);
        const lowercasePassword =   lowercaseRegExp.test(password);
        const digitsPassword =      digitsRegExp.test(password);
        const minLengthPassword =   minLengthRegExp.test(password);

        if ( !email || !password){
            alert('Enter email and password')
            return;
        }

        if(passwordLength===0){
            alert("Password is empty");
        }else if(!uppercasePassword){
            alert("At least one Uppercase");
        }else if(!lowercasePassword){
            alert("At least one Lowercase");
        }else if(!digitsPassword){
            alert("At least one digit");
        }else if(!minLengthPassword){
            alert("At least minumum 8 characters");
        }

        if ( confirmPassword !== password )
        {
            alert('Passwords are not match')
            return;
        }
        try{
            const response = await axios({
                method: 'post',
                url: `${config.APP_API_URL}/register`,
                data:{
                    username: email,
                    password: password
                }
    
            })
    
            const status = response.status;
            if (status === 200)
            {
                setIsRegister(true)
            }
            else
            {
                alert("Register fail!")
            }
        }catch{
            alert("Register fail!")
        }
    }

    async function handlerVerify(e){
        if ( !code || code.length < 6 ){
            alert('Please enter code again')
            return;
        }

        try{
            const response = await axios({
                method: 'post',
                url: `${config.APP_API_URL}/confirm_user`,
                data:{
                    username: email,
                    code: code
                }
    
            })
            const status = response.status;
            if (status === 200)
            {
                redirectPage()
            }
            else
            {
                alert("Verify fail!")
            }

        }catch{
            alert("Verify fail!")
        }
    }

    return (
        <div className="container pt-5">
            {!isRegister && 
            <div className="d-flex justify-content-center">
                <div className="col-md-7">
                    <h2>FCJ Book Store - Register</h2>
                    <div action="/action_page.php">
                        <div className="mb-3 mt-3">
                        <label for="email">Email:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" 
                                onChange={(e) => setEmail( e.target.value )} value={email}/>
                        </div>
                        <div className="mb-3">
                        <label for="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd"
                                onChange={(e) => setPassword( e.target.value )} value={password}/>
                        </div>
                        <div className="mb-3">
                        <label for="pwd">Confirm password:</label>
                            <input type="password" className="form-control" id="cpwd" placeholder="Enter password" name="pswd"
                                onChange={(e) => setConfirmPassword( e.target.value )} value={confirmPassword}/>
                        </div>
                        <button className="btn btn-primary" onClick={handlerRegister}>Register</button>
                    </div>
                </div>
            </div>}
            { isRegister &&
            <div className="d-flex justify-content-center">
                <div className="col-md-7">
                    <h2>Verify Email</h2>
                    <div action="/action_page.php">
                        <div className="mb-3 mt-3">
                            <span>Get code from email and enter verify code:</span>
                        </div>
                        <div className="mb-3">
                        <label for="pwd">Verify code:</label>
                            <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd"
                                onChange={(e) => setCode( e.target.value )} value={code}/>
                        </div>
                        <button className="btn btn-primary" onClick={handlerVerify}>Submit</button>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Register