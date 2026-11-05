let locks = 0;
let prevOverflow = '';
let prevPaddingRight = '';

/** Reference-counted body scroll lock (safe for stacked modals). Returns an unlock function. */
export function lockScroll(): () => void {
  const body = document.body;
  if (locks === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    prevOverflow = body.style.overflow;
    prevPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`; // avoid layout shift
  }
  locks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    }
  };
}