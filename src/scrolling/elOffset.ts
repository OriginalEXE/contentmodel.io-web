const elOffset = (
  el: Element,
): { top: number; left: number; width: number; height: number } => {
  const box = el.getBoundingClientRect();
  const clientTop = document.body.clientTop || 0;
  const clientLeft = document.body.clientLeft || 0;
  const scrollTop = window.pageYOffset || 0;
  const scrollLeft = window.pageXOffset || 0;

  return {
    top: box.top + (scrollTop - clientTop),
    left: box.left + (scrollLeft - clientLeft),
    width: box.width,
    height: box.height,
  };
};

export default elOffset;
