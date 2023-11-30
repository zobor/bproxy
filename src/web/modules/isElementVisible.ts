function isElementVisible(elem: any) {
  const viewport: any = {
    top: window.scrollY,
    left: window.scrollX,
  };
  viewport.right = viewport.left + window.innerWidth;
  viewport.bottom = viewport.top + window.innerHeight;
  const width = elem.offsetWidth;
  const height = elem.offsetHeight;
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();
  const bounds = {
    top: elemRect.top - bodyRect.top,
    right: '',
    bottom: '',
    left: elemRect.left - bodyRect.left,
  };
  bounds.right = bounds.left + width;
  bounds.bottom = bounds.top + height;
  return !(
    viewport.right < bounds.left ||
    viewport.left > bounds.right ||
    viewport.bottom < bounds.top ||
    viewport.top > bounds.bottom
  );
}

export default isElementVisible;
