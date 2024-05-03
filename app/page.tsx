"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videOnPlay, setVideoOnPlay] = useState(false);

  const [played, setPlayed] = useState<{ start: number; end: number }[]>([]); // Initialize the played array

  const playVideo = () => {
    const video = videoRef.current;
    if (video) {
      setVideoOnPlay(true);
      video.play();
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (video) {
      setVideoOnPlay(false);
      video.pause();
      // When video is paused, update the played array
      setPlayed((prevPlayed) => [
        ...prevPlayed,
        { start: video.currentTime, end: video.currentTime },
      ]);
    }
  };

  const unMuteVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
    }
  };

  const muteVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
    }
  };

  const toggleMuteVide = () => {
    if (videOnPlay) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  console.log(played);
  const goToPosition = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("play", () => {
        // When video is played, update the played array
        setPlayed((prevPlayed) => [
          ...prevPlayed,
          { start: video.currentTime, end: video.currentTime },
        ]);
      });
    }
    return () => {
      if (video) {
        video.removeEventListener("play", () => {});
      }
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.buttonContainer}>
        <button onClick={playVideo}>play</button>
        <button onClick={pauseVideo}>pause</button>
        <button onClick={muteVideo}>mute</button>
        <button onClick={unMuteVideo}>unmute</button>
        <button onClick={() => goToPosition(30)}>go to second 30</button>
        <button onClick={toggleMuteVide}>toggle</button>
      </div>

      <div className={styles.videoContainer}>
        <div className={styles.controler}></div>
        <video
          ref={videoRef}
          controls={false}
          width="600"
          height="300"
          loop
          muted
          onClick={toggleMuteVide}
          // poster="imgs/home/cover-speed-website.png"
        >
          <source
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
          Your Browser Does Not Support Video Tag
        </video>
      </div>
    </main>
  );
}
