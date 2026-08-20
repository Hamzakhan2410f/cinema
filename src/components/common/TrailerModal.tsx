import React, { useState, useEffect } from 'react';
import { X, ExternalLink, VideoOff } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index.js';
import { closeTrailer, setTrailerKey } from '../../store/slices/uiSlice.js';
import { useGetMovieTrailerQuery } from '../../store/services/api.js';
import { extractYouTubeId, getYouTubeSearchUrl } from '../../utils/youtube.js';

export const TrailerModal: React.FC = () => {
  const dispatch = useDispatch();
  const {
    isTrailerOpen,
    activeMovieId,
    activeMovieTitle,
    activeTrailerUrl,
    activeTrailerKey,
    candidateKeys,
  } = useSelector((state: RootState) => state.ui);

  const [candidateIndex, setCandidateIndex] = useState(0);

  // Extract initial key if activeTrailerKey is not explicitly set
  const initialKey =
    activeTrailerKey ||
    (candidateKeys && candidateKeys[candidateIndex]) ||
    extractYouTubeId(activeTrailerUrl);

  // Only query TMDB API if modal is open, we have a movieId, and don't have a video key yet
  const shouldFetch = isTrailerOpen && Boolean(activeMovieId) && !initialKey;

  const { data: trailerData, isLoading, isFetching } = useGetMovieTrailerQuery(
    activeMovieId || '',
    { skip: !shouldFetch }
  );

  // Reset candidate index when modal opens or activeMovieId changes
  useEffect(() => {
    if (isTrailerOpen) {
      setCandidateIndex(0);
    }
  }, [isTrailerOpen, activeMovieId]);

  // Save fetched video key into Redux state when response arrives
  useEffect(() => {
    if (trailerData?.success && trailerData.trailerKey && !initialKey) {
      const candidates = trailerData.videos?.map((v) => v.key) || [trailerData.trailerKey];
      dispatch(setTrailerKey({ key: trailerData.trailerKey, candidates }));
    }
  }, [trailerData, initialKey, dispatch]);

  if (!isTrailerOpen) return null;

  const activeKeyToUse =
    activeTrailerKey ||
    (candidateKeys && candidateKeys[candidateIndex]) ||
    extractYouTubeId(activeTrailerUrl);

  const youtubeEmbedUrl = activeKeyToUse
    ? `https://www.youtube.com/embed/${activeKeyToUse}?autoplay=1&rel=0`
    : null;

  const youtubeWatchUrl = activeKeyToUse
    ? `https://www.youtube.com/watch?v=${activeKeyToUse}`
    : getYouTubeSearchUrl(activeMovieTitle);

  const titleText = activeMovieTitle || 'Movie';
  const showLoading = (isLoading || isFetching) && !activeKeyToUse;

  const handleIframeError = () => {
    if (candidateKeys && candidateIndex + 1 < candidateKeys.length) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-black uppercase tracking-widest text-[#E50914] shrink-0">
              OFFICIAL TRAILER
            </span>
            {activeMovieTitle && (
              <span className="text-xs text-zinc-300 font-bold truncate">
                &bull; {activeMovieTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors"
              title="Watch on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Watch on YouTube</span>
            </a>

            <button
              onClick={() => dispatch(closeTrailer())}
              className="w-8 h-8 rounded-sm bg-zinc-800 hover:bg-[#E50914] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              title="Close Trailer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {showLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
                LOADING TRAILER...
              </span>
            </div>
          ) : youtubeEmbedUrl ? (
            <iframe
              key={activeKeyToUse}
              src={youtubeEmbedUrl}
              title={`${titleText} Official Trailer`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
              onError={handleIframeError}
            />
          ) : (
            <div className="p-8 text-center space-y-4 max-w-md">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <VideoOff className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  TRAILER NOT AVAILABLE
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  An official trailer could not be found for this title.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

