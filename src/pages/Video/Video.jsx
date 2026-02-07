import React from 'react'
import './Video.css'
import { useParams } from 'react-router-dom'
import PlayVideo from '../../components/PlayVideo/PlayVideo'
import Recommended from '../../components/Recommended/Recommended'

const Video = () => {
  const { videoId, playlistId } = useParams()

  return (
    <div className='play-container'>
      <PlayVideo videoId={videoId} playlistId={playlistId} />
      <Recommended videoId={videoId} />
    </div>
  )
}

export default Video
