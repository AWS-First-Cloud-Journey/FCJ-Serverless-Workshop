import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import axios from 'axios';
import config from '../../config'
import { Auth } from 'aws-amplify';
import createUser from '../Chat/graphql/mutations/createUser'
import { Hub } from 'aws-amplify';


function Register(props) {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [code, setCode] = React.useState("")
    const [isRegister, setIsRegister] = React.useState(false)
    const {setNavbar} = props
    const [user] = useMutation(createUser)

    const navigate = useNavigate();
    useEffect(() => {
        setNavbar(true);
      }, []);

    const redirectPage = () => {
        navigate('/login');
    }

    async function signUp(e) {
        e.preventDefault();
        const checkResult = checkUserAccountValid()
        if (!checkResult)
        {
            return;
        }
        else if (  confirmPassword !== password )
        {
            return;
        }

        try {
            const { user } = await Auth.signUp({
                username: email,
                password,
                attributes: {
                    email
                },
                autoSignIn: { // optional - enables auto sign in after user is confirmed
                    enabled: true,
                }
            });
            console.log(user);
            setIsRegister(true)
        } catch (error) {
            console.log('error signing up:', error);
        }
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

    function checkUserAccountValid()
    {
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
            return false;
        }

        if(passwordLength===0){
            alert("Password is empty");
            return false
        }else if(!uppercasePassword){
            alert("At least one Uppercase");
            return false
        }else if(!lowercasePassword){
            alert("At least one Lowercase");
            return false
        }else if(!digitsPassword){
            alert("At least one digit");
            return false
        }else if(!minLengthPassword){
            alert("At least minumum 8 characters");
            return false
        }

        return true

    }

    async function confirmSignUp(e) {
        e.preventDefault();
        if ( !code || code.length < 6 ){
            alert('Please enter code again')
            return;
        }

        try {
          await Auth.confirmSignUp(email, code);
        } catch (error) {
            console.log('error confirming sign up', error);
            alert("Verify fail!")
            return;
        }
        try {
            const user = await Auth.signIn(email, password);
        } catch (error) {
            console.log("Sign in fail", error);
            return;
        }
        const session = await Auth.currentSession()
        console.log(session)
        var new_user = {
            username : email,
            id: session.idToken.payload['sub'],
            cognitoId: session.idToken.payload['sub'],
            registered: true
        }
        
        user({
            variables : { username : email },
            optimisticResponse: {
                createUser: {
                    ...new_user,
                    __typename: 'User'
                }
            }
        }).then(
            res => { console.log(res) },
            err => { console.log(err) }
        );
        
        redirectPage()
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
                        <button className="btn btn-primary" onClick={signUp}>Register</button>
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
                        <button className="btn btn-primary" onClick={confirmSignUp}>Submit</button>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Register