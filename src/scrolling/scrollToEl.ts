import elOffset from './elOffset';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const naturalScroll = require('natural-scroll');

const scrollToEl = ({
  el,
  offset = 0,
}: {
  el: Element;
  offset?: number;
}): void => {
  const toScroll = [document.documentElement, document.body];

  toScroll.forEach((toScrollEl) => {
    naturalScroll.scrollTop(toScrollEl, elOffset(el).top - offset);
  });
};

export default scrollToEl;
