"use client";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import "./progress.css";
import Slider from "@mui/material/Slider";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import MenuItem from "@mui/material/MenuItem";
import { Container } from "@mui/material";
import CustomIconButton from "./CustomIconButton";

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

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(30);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreeen] = useState(false);

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
      <Box onMouseMove={handleMouseMove}>
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
            <CustomIconButton onClick={togglePlayVideo}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </CustomIconButton>

            <Slider
              id="progress"
              className="progress"
              max={videoDuration}
              value={progress}
              onChange={(_, value) => onChangeProgress(value as number)}
              size="medium"
              sx={{
                color: "#582b76",
                height: 6,
                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 16,
                  borderRadius: "10px",
                  background: "white",
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  "&::before": {
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  },
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px rgb(255 255 255 / 16%)",
                  },
                  "&.Mui-active": {
                    width: 10,
                    height: 20,
                  },
                },
                "& .MuiSlider-rail": {
                  opacity: 0.28,
                },
              }}
            />

            <label id="timer">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </label>
            <CustomIconButton onClick={volumePopover.onOpen}>
              {volume === 0 ? <VolumeDownRounded /> : <VolumeUpRounded />}
            </CustomIconButton>
            <CustomIconButton onClick={popover.onOpen}>
              <SettingsIcon />
            </CustomIconButton>

            <CustomIconButton>
              {isFullScreen ? (
                <FullscreenExitIcon onClick={exitFullScreen} />
              ) : (
                <FullscreenIcon onClick={enterFullScreen} />
              )}
            </CustomIconButton>
          </figcaption>
        </figure>
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
      >
        <Box
          sx={{
            width: "30px ",
            height: "150px",
            borderRadius: "5px",
            padding: "10px",
            transition: "all 0.25s ease-out",
          }}
          onMouseMove={handleMouseMove}
        >
          <Slider
            size="medium"
            sx={{
              color: "#582b76",
              "& .MuiSlider-thumb": {
                width: 15,
                height: 15,
                transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                "&::before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0px 0px 0px 8px rgb(255 255 255 / 16%)",
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
            }}
            className="slider"
            orientation="vertical"
            defaultValue={30}
            value={volume}
            aria-label="volume"
            onChange={(_, value) => setVolume(value as number)}
          />
        </Box>
      </CustomPopover>
      <CustomPopover
        container={containerRef.current}
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
