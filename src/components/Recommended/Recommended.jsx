import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Recommended.css'
import { API_KEY } from '../../data'

const Recommended = ({ videoId }) => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRelatedVideos = async (id) => {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=12&key=${API_KEY}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Related videos request failed: ${res.status}`)
    }
    const data = await res.json()
    const normalized = (data.items || []).map((item) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      channelTitle: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    }))
    setVideos(normalized.filter((item) => item.id))
  }

  const fetchPopularVideos = async () => {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12&key=${API_KEY}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Popular videos request failed: ${res.status}`)
    }
    const data = await res.json()
    const normalized = (data.items || []).map((item) => ({
      id: item.id,
      title: item.snippet?.title,
      channelTitle: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    }))
    setVideos(normalized.filter((item) => item.id))
  }

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      setIsLoading(true)
      setError('')
      try {
        if (videoId) {
          await fetchRelatedVideos(videoId)
        } else {
          await fetchPopularVideos()
        }
      } catch (err) {
        if (!isMounted) return
        setError('Unable to load recommendations. Showing popular videos.')
        try {
          await fetchPopularVideos()
        } catch (fallbackErr) {
          if (!isMounted) return
          setError('Unable to load recommendations. Check API key or network.')
          setVideos([])
        }
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [videoId])

  return (
    <div className='recommended'>
      {isLoading && <p>Loading recommendations...</p>}
      {!isLoading && error && <p>{error}</p>}
      {videos.map((video) => (
        <Link to={`/video/${video.id}`} className='side-video-list' key={video.id}>
          <img src={video.thumbnail} alt={video.title || 'thumbnail'} />
          <div className='vid-info'>
            <h4>{video.title || 'Untitled video'}</h4>
            <p>{video.channelTitle || 'Unknown channel'}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Recommended
