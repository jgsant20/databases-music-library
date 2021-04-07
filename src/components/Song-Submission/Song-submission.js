import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Song-submission.css"
const SongSubmission = () => {
    const [songNameState, setSongNameState] = useState("");
    const handleSongNameChange = (e) => setSongNameState({
        ...songNameState,
        [e.target.songName]: [e.target.value]
})

    const blankContributor = { name: "" };
    const [contributorState, setContributorState] = useState([
        { ...blankContributor },
        ]);

    const addContributor = () => {
        setContributorState([...contributorState, {...blankContributor}]);
    };

    const handleContributorChange = (e) => {
        const updatedContributors = [...contributorState];
        updatedContributors[e.target.dataset.idx][e.target.className] = e.target.value;
        setContributorState(updatedContributors);
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);

    const fileChangeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
        const formData = new FormData();

        formData.append('File', selectedFile);

        fetch(
            //insert upload API
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success: ', result);
            })
            .catch((error) => {
                console.error('Error: ', error);
            });

    };
    return (
        <form> 
            <label htmlFor="songName">Song Name</label>
            <input
                type='text'
                name="songName"
                id="songName"
                value={songNameState.songName}
                onChange={handleSongNameChange}
                />
            <div>
            <label htmlFor="file">Song File (MP3)</label>
            </div>
            <input type="file" name="file" onChange={fileChangeHandler} />
            {isFilePicked ? (
                <div>
                    <p>Filename: {selectedFile.name}</p>
                    <p>Filetype: {selectedFile.type}</p>
                    <p>Size in bytes: {selectedFile.size}</p>
                    <p>
                        lastModifiedDate:{' '}
                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
            <input
                type="button"
                value="Add New Contributor"
                onClick={addContributor}
            /> 

            {
                contributorState.map((val, idx)=> {
                    let contribID = `name-${idx}`
                    return (
                        <div key={`contributor-${idx}`}>
                        <label htmlFor={contribID}>{`Contributor #${idx + 1}`}</label>
                        <input
                        type='text'
                        name={contribID}
                        data-idx={idx}
                        id={contribID}
                        value={contributorState[idx].name}
                        onChange={handleContributorChange}
                        />
                        </div>
                    );
                })
            }
            <input type= "submit" value="Submit" />
            </form>
    );
}
export default SongSubmission;