import { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/save.png'
import save from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'

const PlayVideo = ({ videoId, playlistId }) => {
  const [apiData, setApiData] = useState(null)
  const [activeVideoId, setActiveVideoId] = useState(videoId || null)
  const [comments, setComments] = useState([])
  const [channelData, setChannelData] = useState(null)

  const fetchVideoData = async (id) => {
    if (!id) {
      setApiData(null)
      return
    }
    const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`
    const res = await fetch(videoDetailsUrl)
    const data = await res.json()
    setApiData(data.items?.[0] ?? null)
  }

  const fetchComments = async (id) => {
    if (!id) {
      setComments([])
      return
    }
    const commentsUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=20&order=relevance&videoId=${id}&key=${API_KEY}`
    const res = await fetch(commentsUrl)
    const data = await res.json()
    setComments(data.items ?? [])
  }

  const fetchChannelData = async (channelId) => {
    if (!channelId) {
      setChannelData(null)
      return
    }
    const channelUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${channelId}&key=${API_KEY}`
    const res = await fetch(channelUrl)
    const data = await res.json()
    setChannelData(data.items?.[0] ?? null)
  }

  const fetchPlaylistFirstVideo = async (id) => {
    if (!id) {
      setActiveVideoId(null)
      return
    }
    const playlistUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${id}&key=${API_KEY}`
    const res = await fetch(playlistUrl)
    const data = await res.json()
    const firstVideoId = data.items?.[0]?.snippet?.resourceId?.videoId ?? null
    setActiveVideoId(firstVideoId)
  }

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistFirstVideo(playlistId)
      return
    }
    setActiveVideoId(videoId || null)
  }, [videoId, playlistId])

  useEffect(() => {
    fetchVideoData(activeVideoId)
    fetchComments(activeVideoId)
  }, [activeVideoId])

  useEffect(() => {
    const channelId = apiData?.snippet?.channelId
    fetchChannelData(channelId)
  }, [apiData])

  return (
    <div className='play-video'>
      <iframe
        src={`https://www.youtube.com/embed/${activeVideoId || ''}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : 'title here'}</h3>
      <div className='play-video-info'>
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : '16k'} &bull;{' '}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : 'date'}
        </p>
        <div>
          <span><img src={like} alt="" />125</span>
          <span><img src={dislike} alt="" />5</span>
          <span><img src={share} alt="" />Share</span>
          <span><img src={save} alt="" />Save</span>
        </div>
      </div>
      <hr />
      <div className='publisher'>
        <img src={channelData?.snippet?.thumbnails?.default?.url || save} alt="" />
        <div>
          <p>
            {channelData?.snippet?.title || 'Channel'}
          </p>
          <span>{channelData ? `${value_converter(channelData.statistics.subscriberCount)} Subscribers` : '0 Subscribers'}</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className='vid-description'>
        <p>Explore the world </p>
        <p>our daily dose of awesome.</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : '0'} comments</h4>
        {comments.length === 0 && (
          <div className='comment'>
            <img src={user_profile} alt="" />
            <div>
              <h3>
                No comments yet
              </h3>
              <span>Just now</span>
              <p>
                Be the first to share your thoughts.
              </p>
            </div>
          </div>
        )}
        {comments.map((item) => {
          const comment = item.snippet?.topLevelComment?.snippet
          if (!comment) {
            return null
          }
          return (
            <div className='comment' key={item.id}>
              <img src={comment.authorProfileImageUrl || user_profile} alt="" />
              <div>
                <h3>
                  {comment.authorDisplayName}
                </h3>
                <span>{moment(comment.publishedAt).fromNow()}</span>
                <p>
                  {comment.textDisplay}
                </p>
                <div className='comment-action'>
                  <img src={like} alt="" />
                  <span>{comment.likeCount ?? 0}</span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayVideo
