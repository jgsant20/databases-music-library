import React, { useState } from "react";
import { getUserId } from "@Src/verifyLogin";
import Form from "react-bootstrap/Form";
import Button from '@material-ui/core/Button';
import "./Song-submission.scss"

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { duration } from "@material-ui/core";
import { ContactSupportOutlined } from "@material-ui/icons";


const SongSubmission = () => {
  const [songNameState, setSongNameState] = useState("");
  const [resultState, setResultState] = useState("");

  const blankContributor = { idNum: '', name: '' };
  const [contributorState, setContributorState] = useState([
    { ...blankContributor },
    ]);

  const addContributor = () => {
    setContributorState([...contributorState, {...blankContributor}]);
  };
  
  const removeContributor = () => {
    const list = [...contributorState];
      if (list.length != 1){
        list.pop()
      }
      setContributorState(list);
  };

  const handleContributorChange = (i, e) => {
    const updatedContributors = [...contributorState];
    updatedContributors[i][e.target.name] = e.target.value;
    setContributorState(updatedContributors);

  };

  const [selectedMP3File, setSelectedMP3File] = useState(null);
  const [isFileMP3Picked, setIsFileMP3Picked] = useState(false);
  const [durationState, setDurationState] = useState(0);

  const mp3FileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    setSelectedMP3File(e.target.files[0]);
    
    let reader = new FileReader();
    reader.onload = (event) => {

    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

      audioContext.decodeAudioData(event.target.result, function(buffer){
       let duration = buffer.duration;

       setDurationState(duration)
      })
    }
    setIsFileMP3Picked(true);
    reader.readAsArrayBuffer(e.target.files[0])
    };


  const [selectedJPGFile, setSelectedJPGFile] = useState(null);
  const [isFileJPGPicked, setIsFileJPGPicked] = useState(false);

  const jpgFileChangeHandler = (e) => {
    setSelectedJPGFile(e.target.files[0]);
    setIsFileJPGPicked(true);
  };

  const isErrorInValidation = () => {
    if (songNameState && selectedJPGFile && selectedMP3File && selectedMP3File.name &&
      selectedMP3File.name.split('.').pop() == "mp3") {
      return false;
    } 

    return true;
  }

  const handleSubmission = () => {
    if (isErrorInValidation()) {
      setResultState("validation_error")
      return;
    }

    setResultState("loading")
    const formData = new FormData();

    formData.append('songName', songNameState);
    formData.append('jpgFile', selectedJPGFile);
    formData.append('musicFile', selectedMP3File);
    formData.append('duration', durationState);
    formData.append('contributors', JSON.stringify(contributorState));
    formData.append('token', localStorage.getItem('token'))

    fetch(`${process.env.API_URL}/api/music?token=${localStorage.getItem('token')}&userID=${getUserId()}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((result) => {
        if (result.status == 200) {
          setResultState("success");
        } else {
          setResultState("error");
        }
      })
      .catch((error) => {
        console.error('Error: ', error);
        setResultState("size-limit")
      });
  };

  return (
    <div className="song-submission">
      <form className="song-submission__container"> 
        <label htmlFor="songName">Song Name</label>
        <input
          type='text'
          name="songName"
          id="songName"
          value={songNameState.songName}
          onChange={(e)=>setSongNameState(e.target.value)}
          />
        <div>
          <label htmlFor="file">Song File (MP3)</label>
        </div>
        <input type="file" name="mp3File" onChange={mp3FileChangeHandler} />
        {isFileMP3Picked ? (
          <div>
            <p>Filename: {selectedMP3File.name}</p>
            <p>Filetype: {selectedMP3File.type}</p>
            <p>Size in bytes: {selectedMP3File.size}</p>
            <p>Length: {selectedMP3File.duration}</p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        <div>
          <label htmlFor="file">Song Cover (jpg)</label>
        </div>
        <input type="file" name="coverFile" onChange={jpgFileChangeHandler} />
        {isFileJPGPicked ? (
          <div>
            <p>Filename: {selectedJPGFile.name}</p>
            <p>Filetype: {selectedJPGFile.type}</p>
            <p>Size in bytes: {selectedJPGFile.size}</p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        <input
          type="button"
          value="Add Contributor"
          onClick={addContributor}
        /> 
        <input
          type="button"
          value="Remove Contributor"
          onClick={removeContributor}
          />
        {
          contributorState.map((val, idx)=> {
            let numID = `num-${idx}`
            let nameID = `name-${idx}`
            return (
              <div key={`contributor-${idx}`}>
              <label htmlFor={numID}>{`Contributor #${idx + 1}`}</label>
              <input
              type='text'
              placeholder='Contributor Name'
              name='name'
              data-idx={idx}
              id={nameID}
              className = "id"
              value={contributorState.name}
              onChange={event => handleContributorChange(idx, event)}
              />
              </div>
            );
          })
        }
        <input type= "button" value="Submit" onClick={handleSubmission} />
        <div className="submit-state">
          {resultState == "success" ? "Success!" :
            resultState == "error" ? "Error!" :
            resultState == "validation_error" ? "Validation Error!" :
            resultState == "size-limit" ? "Size too big!" :
            resultState == "loading" ? "Loading!" :
            null
          }
        </div>
      </form>
    </div>
  );
}

export default SongSubmission;
