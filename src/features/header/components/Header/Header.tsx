import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactText, useEffect, useRef } from 'react';
import { VisuallyHidden, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { Item } from 'react-stately';

import logo from '@/src/shared/assets/logo/logo.svg';
import Avatar from '@/src/shared/components/Avatar/Avatar';
import Button from '@/src/shared/components/Button/Button';
import ToggleMenu from '@/src/shared/components/ToggleMenu/ToggleMenu';
import { useStore } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HeaderSmallScreens: React.FC = observer(() => {
  const store = useStore();
  const router = useRouter();
  const toggleButtonRef = useRef(null);
  const toggleButtonState = useToggleState();
  const { buttonProps } = useToggleButton(
    {},
    toggleButtonState,
    toggleButtonRef,
  );

  useEffect(() => {
    const closeMobileMenuOnRouteChange = () => {
      toggleButtonState.setSelected(false);
    };

    router.events.on('routeChangeStart', closeMobileMenuOnRouteChange);

    return () => {
      router.events.off('routeChangeStart', closeMobileMenuOnRouteChange);
    };
  }, [toggleButtonState, router.events]);

  return (
    <div className="md:hidden">
      <div className="flex justify-between items-center py-1">
        <Link href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="flex items-center justify-center focus:outline-none">
            <img src={logo} alt="contentmodel.io logo" width="112" />
          </a>
        </Link>
        <button
          {...buttonProps}
          className="w-8 h-8 appearance-none inline-flex items-center justify-center focus:outline-none focus:ring-2"
        >
          <VisuallyHidden>Toggle menu</VisuallyHidden>
          <FontAwesomeIcon
            icon={['fas', toggleButtonState.isSelected ? 'times' : 'bars']}
            size="lg"
            fixedWidth
          />
        </button>
      </div>
      {toggleButtonState.isSelected ? (
        <ul>
          <li className="font-semibold">
            <Link href="/">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="no-underline px-3 py-2 block focus:outline-none focus:ring-2">
                Browse
              </a>
            </Link>
          </li>
          <li className="font-semibold">
            <Link href="/content-models/new">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="no-underline px-3 py-2 block focus:outline-none focus:ring-2">
                Share content model
              </a>
            </Link>
          </li>
          <li className="p-3">
            <div className="border-t border-gray-300" />
          </li>
          <li className="p-3 flex items-center">
            {store.me === null ? (
              <div>
                <p>Why not share your content model with others?</p>
                <Button
                  size="s"
                  className="mt-3 mr-2"
                  onClick={() => {
                    router.push('/api/login');
                  }}
                >
                  Sign in
                </Button>
                <Button
                  size="s"
                  color="primary"
                  className="mt-3 mr-2"
                  onClick={() => {
                    router.push('/api/signUp');
                  }}
                >
                  Create an account
                </Button>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center flex-wrap">
                <div className="flex items-center mr-2 mb-2">
                  <div className="w-10 h-10 mr-3">
                    <Avatar {...store.me} />
                  </div>
                  <p>{store.me.name}</p>
                </div>
                <Button
                  size="s"
                  className="mb-2"
                  onClick={() => {
                    router.push('/api/logout');
                  }}
                >
                  Sign out
                </Button>
              </div>
            )}
          </li>
          <li className="font-semibold">
            <Link href="/profile/content-models">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="no-underline px-3 py-2 block focus:outline-none focus:ring-2">
                My content models
              </a>
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  );
});

const HeaderLargeScreens: React.FC = observer(() => {
  const store = useStore();
  const router = useRouter();

  return (
    <div className="hidden md:block">
      <div className="flex items-center py-1">
        <Link href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="flex items-center justify-center focus:outline-none mr-6">
            <img src={logo} alt="contentmodel.io logo" width="112" />
          </a>
        </Link>

        <ul className="flex items-center flex-grow">
          <li className="font-semibold">
            <Link href="/">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="no-underline px-3 py-2 block focus:outline-none focus:ring-2">
                Browse
              </a>
            </Link>
          </li>
          <li className="font-semibold">
            <Link href="/content-models/new">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="no-underline px-3 py-2 block focus:outline-none focus:ring-2">
                Share content model
              </a>
            </Link>
          </li>
          <li
            className={`${
              store.me === null ? 'py-3' : 'py-2'
            } flex items-center ml-auto`}
          >
            {store.me === null ? (
              <div>
                <Button
                  size="s"
                  grow={false}
                  className="mr-2"
                  onClick={() => {
                    router.push('/api/login');
                  }}
                >
                  Sign in
                </Button>
                <Button
                  size="s"
                  grow={false}
                  color="primary"
                  onClick={() => {
                    router.push('/api/signUp');
                  }}
                >
                  Create an account
                </Button>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center flex-wrap">
                <div className="flex items-center">
                  <ToggleMenu
                    onAction={(key: ReactText) => {
                      router.push(key as string);
                    }}
                    aria-label="Menu"
                    buttonClassName="w-10 h-10 appearance-none inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2"
                    buttonLabel="Profile menu"
                    buttonRender={<Avatar {...store.me} />}
                  >
                    <Item key="/profile/content-models">My content models</Item>
                    <Item key="/api/logout">Sign out</Item>
                  </ToggleMenu>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
});

const Header: React.FC = observer(() => {
  return (
    <header className="bg-white shadow-sm relative z-50">
      <nav className="w-full max-w-screen-2xl mx-auto px-3">
        {/* Big screens nav */}
        <HeaderLargeScreens />

        {/* Small screens nav */}
        <HeaderSmallScreens />
      </nav>
    </header>
  );
});

export default Header;
