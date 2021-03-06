import React, { useState, useEffect } from 'react';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

import './MySongsContent.scss';
import Card from "@Components/songCard/songCard"
import useFetch from "@Src/useFetch"

import MusicContainer from "@Components/MusicContainer/MusicContainer"
import EditSong from '@Components/EditSong/EditSong'
import { handleClickOpen } from '@Components/EditSong/EditSong'

import { getUrl } from "@Src/getUrl";
import { getUserId } from "@Src/verifyLogin";

const useStyles = makeStyles((theme) => ({
	root: {
		marginLeft: 10,
		marginRight: 10,
	  flexGrow: 1,
	},
}));

const HomeContent = ({ 
	playMusicHooks,
	setMusicData,
	musicData,
	musicIsPending,
	musicError,
	musicUrl,
	setMusicUrl
}) => {
  const classes = useStyles();
	setMusicUrl("/api/mysongs")

	const deleteOnClick = (obj) => {
		if (confirm("Do you want to delete this song?")) {
			setMusicData(() => (
				musicData.filter((item) => (
					item.songID != obj.songID
				))
			))

			const formData = new FormData();

			formData.append('userID', getUserId())
			formData.append('songID', obj.songID)

			fetch(`${process.env.API_URL}/api/removesong?token=${localStorage.getItem('token')}&userID=${getUserId()}`,
				{
					method: 'POST',
					mode: 'no-cors',
					body: formData,
				}
			)
				.then((response) => response.json)
				.then((result) => {
					console.log('Success: ', result);
				})
				.catch((error) => {
					console.error('Error: ', error);
				});
		}
	}

	const editOnClick = (obj) => {
		

	}


	return (
    <div className={classes.root}>
      <h1 className="content-title">My Songs</h1>
      <Grid container spacing={3}>
        {musicIsPending || !musicData ? null:
        musicData.map((obj, index) => {
          return <MusicContainer 
						key={obj.songID} 
						id={obj.songID} 
						obj={obj} 
						playMusicHooks={playMusicHooks}
						deleteOnClick={deleteOnClick}
						editOnClick={editOnClick}
				  />
        })}
      </Grid>
    </div>
	)
}

export default HomeContent;
