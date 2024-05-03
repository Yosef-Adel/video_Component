"use client";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import "./progress.css";

import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import MenuItem from "@mui/material/MenuItem";
import { CardMedia, Container, Typography } from "@mui/material";
import CustomIconButton from "./CustomIconButton";
import ProgressSlider from "./ProgressSlider";
import VolumeSlider from "./VolumeSlider";

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function VideoComponent() {
  const videoUrl =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(30);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreeen] = useState(false);
  const [isControlVisible, setControlVisible] = useState(true);

  const [played, setPlayed] = useState<{ start: number; end: number }[]>([]);

  const settingsPopover = usePopover();
  const volumePopover = usePopover();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);
    }
  }, []);

  const togglePlayVideo = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        setIsPlaying(false);
        video.pause();
        setPlayed((prevPlayed) => [
          ...prevPlayed,
          { start: video.currentTime, end: video.currentTime },
        ]);
      } else {
        setIsPlaying(true);
        video.play();
      }
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (video) {
      const currentTime = video.currentTime;
      setCurrentTime(currentTime);
      setProgress(currentTime);
    }
  };

  const onChangeProgress = (newProgress: number) => {
    const video = videoRef.current;
    if (video) {
      setProgress(newProgress);
      video.currentTime = newProgress;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume / 100;
    }
  }, [volume]);

  const enterFullScreen = () => {
    setIsFullScreeen(true);
    const container = containerRef.current;
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    setIsFullScreeen(false);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setControlVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setControlVisible(false);
      volumePopover.onClose();
      settingsPopover.onClose();
    }, 2000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  });

  return (
    <Container>
      <Box ref={containerRef} onMouseMove={handleMouseMove}>
        <Box
          sx={{
            boxShadow: `
            0 2.8px 2.2px rgba(0, 0, 0, 0.034),
            0 6.7px 5.3px rgba(0, 0, 0, 0.048),
            0 12.5px 10px rgba(0, 0, 0, 0.06),
            0 22.3px 17.9px rgba(0, 0, 0, 0.072),
            0 41.8px 33.4px rgba(0, 0, 0, 0.086),
            0 100px 80px rgba(0, 0, 0, 0.12)
          `,
            position: "relative",
          }}
        >
          <CardMedia
            component="video"
            ref={videoRef}
            src={videoUrl}
            onClick={togglePlayVideo}
            onTimeUpdate={updateProgress}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            sx={{
              display: "block",
              width: "100%",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              width: "calc(100% - 50px)",
              alignItems: "center",
              borderRadius: "10px",
              gridTemplateColumns: "50px auto min(115px) 50px 50px 50px",
              padding: "10px",
              bgcolor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease-out",
              opacity: isControlVisible ? 1 : 0,
              transform: isControlVisible
                ? "translateY(0)"
                : "translateY(20px)",
              display: "grid",
              pointerEvents: isControlVisible ? "auto" : "none",
            }}
          >
            <CustomIconButton onClick={togglePlayVideo}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </CustomIconButton>

            <ProgressSlider
              max={videoDuration}
              value={progress}
              onChange={onChangeProgress}
            />

            <Typography align="center" color="white" fontSize={14}>
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </Typography>

            <CustomIconButton onClick={volumePopover.onOpen}>
              {volume === 0 ? <VolumeDownRounded /> : <VolumeUpRounded />}
            </CustomIconButton>

            <CustomIconButton onClick={settingsPopover.onOpen}>
              <SettingsIcon />
            </CustomIconButton>

            <CustomIconButton>
              {isFullScreen ? (
                <FullscreenExitIcon onClick={exitFullScreen} />
              ) : (
                <FullscreenIcon onClick={enterFullScreen} />
              )}
            </CustomIconButton>
          </Box>
        </Box>
      </Box>

      <CustomPopover
        container={containerRef.current}
        open={volumePopover.open}
        onClose={volumePopover.onClose}
        arrow="bottom-center"
        hiddenArrow
        sx={{
          backdropFilter: "blur(100px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        onMouseMove={handleMouseMove}
      >
        <Box
          sx={{
            width: "30px ",
            height: "150px",
            borderRadius: "5px",
            padding: "10px",
            transition: "all 0.25s ease-out",
          }}
        >
          <VolumeSlider value={volume} onChange={setVolume} />
        </Box>
      </CustomPopover>
      <CustomPopover
        container={containerRef.current}
        open={settingsPopover.open}
        onClose={settingsPopover.onClose}
        arrow="bottom-center"
        hiddenArrow
        sx={{
          width: 140,
          backdropFilter: "blur(100px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        onMouseMove={handleMouseMove}
      >
        <MenuItem
          onClick={() => {
            //
          }}
        >
          Speed
        </MenuItem>
        <MenuItem>Share</MenuItem>

        <MenuItem
          onClick={() => {
            //
          }}
        >
          Subtitle
        </MenuItem>
      </CustomPopover>
    </Container>
  );
}
