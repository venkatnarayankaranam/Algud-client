import { useState } from "react";

function isVideo(url) {
  return url.match(/\.(mp4|webm|ogg)$/i);
}

export default function ProductMediaGallery({ media }) {
  const [selected, setSelected] = useState(0);
  const [fade, setFade] = useState(false);

  const handleSelect = (idx) => {
    setFade(true);
    setTimeout(() => {
      setSelected(idx);
      setFade(false);
    }, 150); // match animation duration
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main Display */}
      <div className="flex-1 flex items-center justify-center min-h-[320px]">
        <div
          className={`relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden group transition-all duration-200 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          {isVideo(media[selected]) ? (
            <video
              src={media[selected]}
              controls
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
            />
          ) : (
            <img
              src={media[selected]}
              alt="Product"
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 cursor-zoom-in"
            />
          )}
        </div>
      </div>
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 md:gap-4 mt-4 md:mt-0 justify-center">
        {media.map((url, idx) => (
          <button
            key={url}
            onClick={() => handleSelect(idx)}
            className={`border-2 rounded-lg overflow-hidden focus:outline-none transition-all duration-150 ${
              selected === idx
                ? "border-black shadow-lg"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
            style={{ width: 64, height: 64 }}
            aria-label={`Show media ${idx + 1}`}
          >
            {isVideo(url) ? (
              <video
                src={url}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <img
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
