import React, { useState } from 'react';
import './AdminScreen.css'

const AdminScreen = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-and-replace-data/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log("Added Data");
      } else {
        console.log("Failed to add Data");
      }
    }
    catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className='container-fluidity'>
      <div className='titleArea'>
        <h1 className='text-maroon'>Admin Dashboard</h1>
      </div>
      <form className='inputJson' onSubmit={handleSubmit}>
        <label>
          JSON File:
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button className='replaceDataBtn' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminScreen;