import React, { Component } from 'react';
import '../Screen/Home/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRightFromBracket , faUser,  faTrash} from '@fortawesome/free-solid-svg-icons'

class UserOption extends Component {
    render() {
        const { userData , Logout} = this.props;

        return (
            <div className="btn-group dropup d-grid gap-2 col-6 mx-auto">
                <button class="btn btn-warning btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">                                 {userData ? userData.name : 'Loading...'}
                </button>
                <ul className="dropdown-menu mx-auto">
                    <li>
                        <a class="dropdown-item" href="#">
                            <FontAwesomeIcon icon={faUser} style={{color: "#541212",}} />
                            Profile
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">
                            <FontAwesomeIcon icon={faTrash} style={{color: "#541212",}} />
                            Delete All Chat
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" onClick={Logout}>
                            <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#541212",}} />
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default UserOption;
