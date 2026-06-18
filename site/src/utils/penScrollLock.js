export function createPenScrollLock(container) {
  const activePenIds = new Set();
  let lockedScrollTop = 0;

  const syncLock = () => {
    const locked = activePenIds.size > 0;
    container.classList.toggle('is-pen-drawing', locked);
    if (locked) {
      lockedScrollTop = container.scrollTop;
    }
  };

  const clearFrameMarks = () => {
    container.querySelectorAll('.viewer-page-frame.is-pen-active').forEach((frame) => {
      frame.classList.remove('is-pen-active');
    });
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== 'pen') return;

    const frame = event.target.closest('.viewer-page-frame');
    if (!frame) return;

    event.preventDefault();
    activePenIds.add(event.pointerId);
    frame.classList.add('is-pen-active');
    syncLock();
  };

  const onPointerMove = (event) => {
    if (event.pointerType !== 'pen') return;
    if (activePenIds.size === 0) return;
    event.preventDefault();
  };

  const releasePen = (event) => {
    if (event.pointerType !== 'pen') return;
    if (!activePenIds.has(event.pointerId)) return;

    event.preventDefault();
    activePenIds.delete(event.pointerId);

    if (activePenIds.size === 0) {
      clearFrameMarks();
      syncLock();
      return;
    }

    event.target.closest('.viewer-page-frame')?.classList.remove('is-pen-active');
  };

  const blockGhostTouch = (event) => {
    if (activePenIds.size === 0) return;
    if (event.touches.length === 2) return;
    event.preventDefault();
  };

  const restoreScroll = () => {
    if (activePenIds.size === 0) return;
    if (container.scrollTop !== lockedScrollTop) {
      container.scrollTop = lockedScrollTop;
    }
  };

  const capture = { capture: true, passive: false };
  container.addEventListener('pointerdown', onPointerDown, capture);
  container.addEventListener('pointermove', onPointerMove, capture);
  container.addEventListener('pointerup', releasePen, capture);
  container.addEventListener('pointercancel', releasePen, capture);
  container.addEventListener('touchstart', blockGhostTouch, capture);
  container.addEventListener('touchmove', blockGhostTouch, capture);

  return {
    isPenLocked: () => activePenIds.size > 0,
    restoreScroll,
    destroy() {
      activePenIds.clear();
      clearFrameMarks();
      container.classList.remove('is-pen-drawing');
      container.removeEventListener('pointerdown', onPointerDown, capture);
      container.removeEventListener('pointermove', onPointerMove, capture);
      container.removeEventListener('pointerup', releasePen, capture);
      container.removeEventListener('pointercancel', releasePen, capture);
      container.removeEventListener('touchstart', blockGhostTouch, capture);
      container.removeEventListener('touchmove', blockGhostTouch, capture);
    },
  };
}
