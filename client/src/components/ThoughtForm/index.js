//we use the useref hook to retrieve the image file uploaded by the user by accessing the <input type="file"> element
import React, { useState, useRef } from 'react';

const ThoughtForm = () => {
  const [formState, setFormState] = useState({ username: '', thought: '' });
  const [characterCount, setCharacterCount] = useState(0);
  //setting the ref to null allows us to make sure the reference to the dom elemtn is current 
  const fileInput = useRef(null);

  //configuring the paramters that are neccessary to send the image file to the upload endpoint

  //this function will retrieve the image file uploaded by the user and send the data in a request to the image upload endpoint that we created.
  const handleImageUpload = event => {
    event.preventDefault();
    const data = new FormData();
    data.append('image', fileInput.current.files[0]);
    // send image file to endpoint with the postImage function
    //because the upload image process to S3 is an asynchronous req, it is possibel to submit the form before the upload process is asynchronous - 
    //add a progress bar or disable the form submit button until the image has loaded

    const postImage = async () => {
      try {
        const res = await fetch('/api/image-upload', {
          mode: 'cors',
          //using a post meoth to send the image file as data in the body of the fetch request
          method: 'POST',
          body: data
        })
        if (!res.ok) throw new Error(res.statusText);
        const postResponse = await res.json();
        //the new key value pair is image: postResponse.Location which is te public URL of the image.
        //try catch block will track any unsuccessful S3 calls
        setFormState({...formState, image: postResponse.Location})
        console.log(postResponse.Location)
        return postResponse.Location;
      } catch (error) {
        console.log(error);
      }
    };
    postImage();
  };




  // update state based on form input changes
  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = event => {
    event.preventDefault();
    // POST method with formState
    const postData = async () => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      })
      const data = await res.json();
      console.log(data);
    }
    postData();
    // clear form value
    setFormState({ username: '', thought: '' });
    setCharacterCount(0);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
          {/* {error && <span className="ml-2">Something went wrong...</span>} */}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <label className="form-input col-12  p-1">
          Add an image to your thought:
  <input
            type="file"
            ref={fileInput}
            className="form-input p-2"
          />
          <button
            className="btn"
            onClick={handleImageUpload}
            type="submit"
          >
            Upload
  </button>
        </label>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
          </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
