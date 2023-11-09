import React , {useState} from 'react';
import axios from 'axios';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane , faPlus , faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

function Home() {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [chatName , setChatName] = useState('');

    const handleInputChange = (identifier) => (e) => {
      if (identifier === "input") {
        setInput(e.target.value);
      } else if (identifier === "chat") {
        setChatName(e.target.value);
      }
      // Add more conditions for additional inputs
  };

    const handleCreateChat = () => {
      console.log(chatName);
      axios.post('http://127.0.0.1:8000/api/threads/' , {
        thread_name: chatName,
      })
      .then(function (response) {
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              New chat Created!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      })
      .catch(function (error)  {
        //handle error
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              Something went Wrong, Try Again Later!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
        console.log(error);
      });
    }

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
              { text: responseData.result, user: false }, 
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
      {/* Modal */}
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">New Chat</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col">
                  <input type="text" class="form-control" id="validationCustom03" placeholder='Chat Name'required onChange={handleInputChange("chat")}/>
                </div>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreateChat}>Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-history">
        <button type="button" class="btn btn-outline-light newChatBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
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
            <div className="input-group mb-1">
                <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" value={input} onChange={handleInputChange("input1")}/>
                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: "#841818",}} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Home;