import { useCallback, useEffect, useRef, useState } from 'react';

function coverScale(frameWidth, frameHeight, imageWidth, imageHeight) {
  return Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
}

export default function NjgoEventPhoto({ src }) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageSize, setImageSize] = useState(null);
  const [touchExpand, setTouchExpand] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setTouchExpand(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const measureImageSize = useCallback(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img?.naturalWidth) {
      return null;
    }

    const scale = coverScale(
      frame.clientWidth,
      frame.clientHeight,
      img.naturalWidth,
      img.naturalHeight,
    );

    return {
      width: `${img.naturalWidth * scale}px`,
      height: `${img.naturalHeight * scale}px`,
    };
  }, []);

  const updateImageSize = useCallback(() => {
    const size = measureImageSize();
    if (size) {
      setImageSize(size);
    }
  }, [measureImageSize]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateImageSize();
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [updateImageSize]);

  const expand = useCallback(() => {
    if (!imageSize) {
      updateImageSize();
    }
    setIsExpanded(true);
  }, [imageSize, updateImageSize]);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handlePointerEnter = (event) => {
    if (event.pointerType !== 'mouse') {
      return;
    }
    expand();
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType !== 'mouse') {
      return;
    }
    collapse();
  };

  const handlePointerUp = (event) => {
    if (event.pointerType !== 'touch') {
      return;
    }
    event.preventDefault();
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  };

  const handleLoad = () => {
    updateImageSize();
    if (frameRef.current?.matches(':hover')) {
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const handleOutside = (event) => {
      if (event.pointerType !== 'touch') {
        return;
      }
      if (!frameRef.current?.contains(event.target)) {
        collapse();
      }
    };

    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [isExpanded, collapse]);

  return (
    <div
      ref={frameRef}
      className={[
        'njgo-roster-photo-frame',
        'njgo-event-photo-frame',
        isExpanded ? 'njgo-event-photo-frame--expanded' : '',
      ].filter(Boolean).join(' ')}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      role={touchExpand ? 'button' : undefined}
      tabIndex={touchExpand ? 0 : undefined}
      aria-expanded={touchExpand ? isExpanded : undefined}
      onKeyDown={(event) => {
        if (!touchExpand || (event.key !== 'Enter' && event.key !== ' ')) {
          return;
        }
        event.preventDefault();
        if (isExpanded) {
          collapse();
        } else {
          expand();
        }
      }}
    >
      <img
        ref={imgRef}
        className="njgo-roster-photo njgo-event-photo"
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        style={imageSize ?? undefined}
        onLoad={handleLoad}
      />
    </div>
  );
}
