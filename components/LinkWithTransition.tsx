'use client';

import Link, { type LinkProps } from 'next/link';
import { useCallback } from 'react';
import { startPageTransition } from './transition/pageTransition';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LinkWithTransitionProps = LinkProps & AnchorProps;

export default function LinkWithTransition({
  children,
  onClick,
  target,
  rel,
  ...rest
}: LinkWithTransitionProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey ||
        target && target !== '_self'
      ) {
        return;
      }
      startPageTransition();
    },
    [onClick, target]
  );

  return (
    <Link {...rest} onClick={handleClick} target={target} rel={rel}>
      {children}
    </Link>
  );
}
