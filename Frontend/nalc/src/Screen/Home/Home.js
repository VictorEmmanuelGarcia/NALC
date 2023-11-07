import React , {useState} from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane , faPlus , faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

function Home() {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add the user's message to the conversation
    setConversation([...conversation, { text: input, user: true }]);
    setInput('');
  };

  return (
    <div className="container-fluid gx-0">
      <div className="chat-history">
        <button class="btn btn-outline-light newChatBtn" type="button">
            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
            <span style={{ marginLeft: "5px" }}>New Chat</span>
        </button>
        <button class="btn  logoutBtn" type="button">
            <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff",}} />
            <span style={{ marginLeft: "5px" , color: "white"}}>Log Out</span>
        </button>
      </div>
      <div className="chat-input">
        <div className='convo'>

        </div>
        <div className='inputForm'>
            <div class="input-group mb-1">
                <input type="text" class="form-control" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                <button class="btn btn-outline-secondary" type="button" id="button-addon2">
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: "#841818",}} />
                </button>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default Home;