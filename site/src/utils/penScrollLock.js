export function createPenScrollLock(container, shouldLockTouch = () => false) {
  const activePointerIds = new Set();
  let lockedScrollTop = 0;

  const shouldLockPointer = (event) => {
    if (event.pointerType === 'pen') return true;
    if (event.pointerType === 'mouse' && event.button !== 0) return false;
    if (
      (event.pointerType === 'touch' || event.pointerType === 'mouse') &&
      shouldLockTouch()
    ) {
      return true;
    }
    return false;
  };

  const syncLock = () => {
    const locked = activePointerIds.size > 0;
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
    if (!shouldLockPointer(event)) return;

    const frame = event.target.closest('.viewer-page-frame');
    if (!frame) return;

    event.preventDefault();
    activePointerIds.add(event.pointerId);
    frame.classList.add('is-pen-active');
    syncLock();
  };

  const onPointerMove = (event) => {
    if (activePointerIds.size === 0) return;
    if (!activePointerIds.has(event.pointerId)) return;
    event.preventDefault();
  };

  const releasePointer = (event) => {
    if (!activePointerIds.has(event.pointerId)) return;

    event.preventDefault();
    activePointerIds.delete(event.pointerId);

    if (activePointerIds.size === 0) {
      clearFrameMarks();
      syncLock();
      return;
    }

    event.target.closest('.viewer-page-frame')?.classList.remove('is-pen-active');
  };

  const blockGhostTouch = (event) => {
    if (activePointerIds.size === 0) return;
    if (event.touches.length === 2) return;
    event.preventDefault();
  };

  const restoreScroll = () => {
    if (activePointerIds.size === 0) return;
    if (container.scrollTop !== lockedScrollTop) {
      container.scrollTop = lockedScrollTop;
    }
  };

  const capture = { capture: true, passive: false };
  container.addEventListener('pointerdown', onPointerDown, capture);
  container.addEventListener('pointermove', onPointerMove, capture);
  container.addEventListener('pointerup', releasePointer, capture);
  container.addEventListener('pointercancel', releasePointer, capture);
  container.addEventListener('touchstart', blockGhostTouch, capture);
  container.addEventListener('touchmove', blockGhostTouch, capture);

  return {
    isPointerLocked: () => activePointerIds.size > 0,
    /** @deprecated Use isPointerLocked */
    isPenLocked: () => activePointerIds.size > 0,
    restoreScroll,
    destroy() {
      activePointerIds.clear();
      clearFrameMarks();
      container.classList.remove('is-pen-drawing');
      container.removeEventListener('pointerdown', onPointerDown, capture);
      container.removeEventListener('pointermove', onPointerMove, capture);
      container.removeEventListener('pointerup', releasePointer, capture);
      container.removeEventListener('pointercancel', releasePointer, capture);
      container.removeEventListener('touchstart', blockGhostTouch, capture);
      container.removeEventListener('touchmove', blockGhostTouch, capture);
    },
  };
}
