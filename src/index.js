import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle'


<<<<<<< HEAD
// const client = new AWSAppSyncClient({
//     url: aws_config.aws_appsync_graphqlEndpoint,
//     cache: new InMemoryCache(),
//     region: aws_config.aws_appsync_region,
//     auth: {
//       type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
//       jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
//     },
//     disableOffline: true
//   });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
>>>>>>> ba7a30b2e9e2adebc1ab7c04b9ef00ee2fa6d948
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
