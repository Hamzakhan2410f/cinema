import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  RotateCcw,
  RotateCw,
  Settings,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Film,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { Movie } from '../../types/index.js';

interface MoviePlayerProps {
  movie?: Movie | null;
  videoUrl?: string | null;
  poster?: string;
  title?: string;
  videoType?: 'mp4' | 'hls' | 'embed' | null;
  onBack?: () => void;
}

export const MoviePlayer: React.FC<MoviePlayerProps> = ({
  movie,
  videoUrl,
  poster,
  title,
  videoType = 'mp4',
  onBack,
}) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  const displayTitle = title || movie?.title || 'Movie Player';
  const displayPoster = poster || movie?.backdropPath || movie?.posterPath || '';

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle HLS & Native Video Loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    const isHlsStream =
      videoType === 'hls' ||
      videoUrl.includes('.m3u8') ||
      videoUrl.includes('manifest');

    if (isHlsStream && Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setErrorMessage('Failed to load HLS video stream.');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && isHlsStream) {
      // Native Safari HLS
      video.src = videoUrl;
    } else {
      // Standard Direct MP4 / WebM
      video.src = videoUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, videoType]);

  // Video Event Handlers
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);

    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    setIsLoading(false);
  };

  const handlePlayPauseToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Play error:', err);
          setHasError(true);
          setErrorMessage('Playback error. Please interact with page to enable audio/video.');
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleSeekRelative = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    setVolume(val);
    if (video) {
      video.volume = val;
      video.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      video.volume = 0.5;
      setVolume(0.5);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowSpeedMenu(false);
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handlePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  };

  // Reset controls timer on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3500);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          handlePlayPauseToggle();
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullscreenToggle();
          break;
        case 'KeyM':
          e.preventDefault();
          handleMuteToggle();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeekRelative(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeekRelative(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.min(1, volume + 0.1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
            setIsMuted(false);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.max(0, volume - 0.1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
            if (newVol === 0) setIsMuted(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPauseToggle, volume]);

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    setHoverPosition(clampedPos * 100);
    setHoverTime(clampedPos * duration);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (movie?.externalId) {
      navigate(`/movie/${movie.externalId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video max-h-[85vh] bg-black rounded-lg overflow-hidden select-none group shadow-2xl border border-zinc-800"
    >
      {/* HTML5 Native Video Tag */}
      <video
        ref={videoRef}
        poster={displayPoster}
        playsInline
        onClick={handlePlayPauseToggle}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Error loading video source. Please check source authorization.');
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-20 pointer-events-none space-y-3">
          <Loader2 className="w-12 h-12 text-[#E50914] animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
            LOADING STREAM...
          </span>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 z-30 p-6 text-center space-y-4">
          <div className="p-4 bg-red-950/50 border border-red-800/60 rounded-full text-[#E50914]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-black uppercase text-white tracking-wider">
              PLAYBACK ERROR
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              {errorMessage || 'Unable to play video source. Please try again later.'}
            </p>
          </div>
          <button
            onClick={handleBackClick}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors"
          >
            Return to Movie Details
          </button>
        </div>
      )}

      {/* Big Center Play/Pause Button on Pause */}
      {!isPlaying && !isLoading && !hasError && (
        <button
          onClick={handlePlayPauseToggle}
          className="absolute inset-0 m-auto w-20 h-20 bg-[#E50914]/90 hover:bg-[#E50914] hover:scale-110 text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-10"
          title="Play Movie"
        >
          <Play className="w-9 h-9 fill-white translate-x-0.5" />
        </button>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between z-20 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 bg-black/60 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-sm border border-zinc-700/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <Film className="w-4 h-4 text-[#E50914]" />
          <span className="text-xs font-black uppercase text-white tracking-wider max-w-xs md:max-w-md truncate">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 transition-opacity duration-300 space-y-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar Container */}
        <div className="relative group/progress cursor-pointer py-1" onMouseMove={handleProgressBarMouseMove} onMouseLeave={() => setHoverTime(null)}>
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-8 -translate-x-1/2 bg-zinc-900 border border-zinc-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none z-30"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Progress Slider Track */}
          <div className="relative w-full h-1.5 group-hover/progress:h-2.5 bg-zinc-800 rounded-full overflow-hidden transition-all">
            {/* Buffered Track */}
            <div
              className="absolute top-0 left-0 h-full bg-zinc-600/60 transition-all"
              style={{ width: `${(buffered / (duration || 1)) * 100}%` }}
            />
            {/* Played Track */}
            <div
              className="absolute top-0 left-0 h-full bg-[#E50914] transition-all"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Controls Layout */}
        <div className="flex items-center justify-between text-white pt-1">
          {/* Left Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={handlePlayPauseToggle}
              className="hover:text-[#E50914] transition-colors p-1"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => handleSeekRelative(-10)}
              className="hover:text-zinc-300 transition-colors p-1 hidden sm:block"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSeekRelative(10)}
              className="hover:text-zinc-300 transition-colors p-1 hidden sm:block"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Controls */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={handleMuteToggle}
                className="hover:text-[#E50914] transition-colors p-1"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-zinc-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-20 h-1 accent-[#E50914] cursor-pointer hidden sm:block"
              />
            </div>

            {/* Timestamp */}
            <div className="text-[11px] font-mono text-zinc-300 font-semibold tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3 relative">
            {/* Playback Speed Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-xs font-mono font-bold bg-zinc-800/80 hover:bg-zinc-700 px-2 py-1 rounded-sm border border-zinc-700/60 transition-colors flex items-center gap-1"
                title="Playback Speed"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-9 right-0 bg-zinc-900 border border-zinc-700 rounded shadow-xl py-1 w-24 text-xs font-mono z-40">
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#E50914] hover:text-white transition-colors ${
                        playbackSpeed === s ? 'text-[#E50914] font-bold' : 'text-zinc-300'
                      }`}
                    >
                      {s}x {s === 1.0 && '(Normal)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PiP Button */}
            {document.pictureInPictureEnabled && (
              <button
                onClick={handlePictureInPicture}
                className="hover:text-zinc-300 transition-colors p-1 hidden sm:block"
                title="Picture in Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={handleFullscreenToggle}
              className="hover:text-[#E50914] transition-colors p-1"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
