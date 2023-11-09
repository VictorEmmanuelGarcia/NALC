import React , {useState} from 'react';
import axios from 'axios';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane , faPlus , faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

function Home() {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendMessage = () => {
      if (input.trim() === '') {
        // Display error or handle accordingly
      } else {
        axios.post('http://127.0.0.1:8000/langchain/', {
          key1: input,
        })
          .then(function (response) {
            // Handle success
            const responseData = response.data.response; // responseData is already an object
            // Add the user's message and the response data to the conversation
            setConversation([
              ...conversation,
              { text: input, user: true },
              { text: responseData.result, user: false }, // Assuming you want to display the 'result' property
            ]);
            setInput('');
          })
          .catch(function (error) {
            // Handle error
            console.log(error);
          });
      }
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
          <div>
            {conversation.map((message, index) => (
              <div key={index}>
                {message.user ? 'User: ' : 'Bot: '}
                {message.text}
              </div>
            ))}
          </div>
        </div>
        <div className='inputForm'>
            <div class="input-group mb-1">
                <input type="text" class="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" value={input} onChange={handleInputChange}/>
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: "#841818",}} />
                </button>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default Home;