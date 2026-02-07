import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Video from './pages/Video/Video'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/video/dQw4w9WgXcQ" replace />} />
        <Route path="/video/:videoId" element={<Video />} />
        <Route path="/playlist/:playlistId" element={<Video />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
