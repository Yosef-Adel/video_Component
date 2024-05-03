"use client";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import "./progress.css";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import MenuItem from "@mui/material/MenuItem";
import Iconify from "@/components/iconify";
import { Container } from "@mui/material";

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(30);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreeen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [played, setPlayed] = useState<{ start: number; end: number }[]>([]);

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
      const duration = video.duration;
      const progress = (currentTime / duration) * 100 || 0;
      setProgress(progress);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLProgressElement>) => {
    if (!isDragging) return;
    const progressBar = e.currentTarget;
    const clickedTime =
      (e.nativeEvent.offsetX / progressBar.clientWidth) * progressBar.max;
    const video = videoRef.current;
    if (video) {
      setProgress(clickedTime);
      video.currentTime = (clickedTime * video.duration) / 100;
      setCurrentTime((clickedTime * video.duration) / 100);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

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

  // --------------------
  //
  const [isControlVisible, setControlVisible] = useState(true);
  const controlVisibilityTimeout = useRef(null);

  const handleMouseMove = () => {
    // clearTimeout(controlVisibilityTimeout.current);
    // setControlVisible(true);
    // controlVisibilityTimeout.current = setTimeout(() => {
    //   setControlVisible(false);
    //   handleClose();
    // }, 3000); // Hide controls after 3 seconds
  };

  useEffect(() => {
    return () => clearTimeout(controlVisibilityTimeout.current); // Clear timeout on unmount
  }, []);

  const popover = usePopover();
  const volumePopover = usePopover();
  return (
    <Container ref={containerRef}>
      <Box onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
        <figure>
          <video
            ref={videoRef}
            src={videoUrl}
            onClick={togglePlayVideo}
            onTimeUpdate={updateProgress}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>

          <figcaption
            style={{
              display: isControlVisible ? "grid" : "none",
            }}
          >
            <IconButton
              onClick={togglePlayVideo}
              aria-label={isPlaying ? "Pause" : "Play"}
              sx={{
                border: "none",
                minWidth: "30px !important",
                minHeight: "30px",
                borderRadius: "5px",
                color: "white",
                padding: "0.5rem",
                transition: "opacity 0.25s ease-out",
                backdropFilter: "blur(100px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {isPlaying ? (
                <PauseIcon
                  sx={{
                    width: "24px",
                    height: "24px",
                  }}
                />
              ) : (
                <PlayArrowIcon />
              )}
            </IconButton>
            <progress
              id="progress"
              max="100"
              value={progress}
              onClick={handleProgressBarClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleProgressBarClick}
            >
              Progress
            </progress>
            <label id="timer">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </label>
            <IconButton
              onClick={volumePopover.onOpen}
              sx={{
                border: "none",
                minWidth: "30px !important",
                minHeight: "30px",
                borderRadius: "5px",
                color: "white",
                padding: "0.5rem",
                transition: "opacity 0.25s ease-out",
                backdropFilter: "blur(100px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {volume === 0 ? <VolumeDownRounded /> : <VolumeUpRounded />}
            </IconButton>
            <IconButton
              sx={{
                border: "none",
                minWidth: "30px !important",
                minHeight: "30px",
                borderRadius: "5px",
                color: "white",
                padding: "0.5rem",
                transition: "opacity 0.25s ease-out",
                backdropFilter: "blur(100px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
              onClick={popover.onOpen}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              sx={{
                border: "none",
                minWidth: "30px !important",
                minHeight: "30px",
                borderRadius: "5px",
                color: "white",
                padding: "0.5rem",
                transition: "opacity 0.25s ease-out",
                backdropFilter: "blur(100px)",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {isFullScreen ? (
                <FullscreenExitIcon onClick={exitFullScreen} />
              ) : (
                <FullscreenIcon onClick={enterFullScreen} />
              )}
            </IconButton>
          </figcaption>
        </figure>
      </Box>

      <CustomPopover
        open={volumePopover.open}
        onClose={volumePopover.onClose}
        arrow="bottom-center"
        hiddenArrow
        sx={{
          backdropFilter: "blur(100px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            width: "30px ",
            height: "150px",
            zIndex: 90000000,
            borderRadius: "5px",
            padding: "10px",
            transition: "opacity 0.25s ease-out",
          }}
          onMouseMove={handleMouseMove}
        >
          <Slider
            sx={{
              '& input[type="range"]': {
                WebkitAppearance: "slider-vertical",
              },
            }}
            className="slider"
            orientation="vertical"
            defaultValue={30}
            value={volume}
            aria-label="volume"
            onKeyDown={preventHorizontalKeyboardNavigation}
            onChange={(event) => setVolume(event.target.value)}
          />
        </Box>
      </CustomPopover>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        hiddenArrow
        sx={{
          width: 140,
          backdropFilter: "blur(100px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
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
