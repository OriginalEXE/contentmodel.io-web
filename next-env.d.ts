/// <reference types="next" />
/// <reference types="next/types/global" />

/// <reference types="next-images" />

declare module 'catchify' {
  function catchify<E extends Error, T>(a: Promise<T>): Promise<[E, T]>;
  export default catchify;
}

declare module 'rehype-highlight';
