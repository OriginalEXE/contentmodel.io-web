import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface ActiveLinkProps extends LinkProps {
  anchorClassName: (isActive: boolean) => string;
}

const ActiveLink: React.FC<ActiveLinkProps> = (props) => {
  const { children, anchorClassName, ...linkProps } = props;

  const router = useRouter();

  const isActive = linkProps.href === router.asPath;

  return (
    <Link {...linkProps}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={anchorClassName(isActive)}>{children}</a>
    </Link>
  );
};

export default ActiveLink;
