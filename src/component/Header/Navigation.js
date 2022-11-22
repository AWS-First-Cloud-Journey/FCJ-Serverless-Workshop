import React, {useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import TextsmsIcon from '@material-ui/icons/Textsms';
import Badge from "@material-ui/core/Badge";

function Navigation(props) {
    const [itemCount, setItemCount] = React.useState(0);
    const [isAdmin, setAdmin] = React.useState(false);
    const [isLogin, setIsLogin] = React.useState(false);
    const [messageCount, setMessageCount] = React.useState(false);
    useEffect( () => {
        setItemCount(props.itemCount)
        setAdmin(props.itemAdminLogin)
        setIsLogin(props.itemUserLogin)
    }, [props.itemCount, props.itemAdminLogin])

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container-fluid">
                <span className="navbar-brand">FCJ Book Store</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mynavbar">
                    <div className="navbar-nav me-auto">
                        <NavLink className="nav-item nav-link" to="/" activeclassname="active">Home</NavLink>
                        { isAdmin && <NavLink className="nav-item nav-link" to="/upload">Create new book</NavLink>}
                        { isAdmin && <NavLink className="nav-item nav-link" to="/admin">Management</NavLink>}
                        { isAdmin && <NavLink className="nav-item nav-link" to="/order">Orders</NavLink>}
                    </div>
                    {isLogin ?
                        <NavLink className="nav-item nav-link" to="/logout">Logout</NavLink>
                        :
                        <div className="navbar-nav">
                            <NavLink className="nav-link" to="/login">Login</NavLink>
                            <NavLink className="nav-link" to="/register">Register</NavLink>
                        </div>
                    }               

                    <NavLink className="nav-item nav-link" to="/cart">
                        <Badge color="secondary" badgeContent={itemCount}>
                            <ShoppingCartIcon />{" "}
                        </Badge>
                    </NavLink>
                    {isLogin &&
                        <NavLink className="nav-item nav-link" to="/chat">
                            <Badge color="secondary" badgeContent={messageCount}>
                                <TextsmsIcon />{" "}
                            </Badge>
                        </NavLink>
                    }
                </div>
            </div>
        </nav>      
    )
}

export default Navigation;
