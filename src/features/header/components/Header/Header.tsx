import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactText, useEffect, useRef } from 'react';
import { VisuallyHidden, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { Item } from 'react-stately';

import logo from '@/src/shared/assets/logo/logo.svg';
import ActiveLink from '@/src/shared/components/ActiveLink/ActiveLink';
import Avatar from '@/src/shared/components/Avatar/Avatar';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import ToggleMenu from '@/src/shared/components/ToggleMenu/ToggleMenu';
import { useStore } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Header.module.css';

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
            <img src={logo} alt="ContentModel.io logo" width="112" />
          </a>
        </Link>
        <button
          {...buttonProps}
          className="w-8 h-8 appearance-none inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600"
        >
          <VisuallyHidden>Toggle menu</VisuallyHidden>
          <FontAwesomeIcon
            icon={['fal', toggleButtonState.isSelected ? 'times' : 'bars']}
            size="lg"
            fixedWidth
          />
        </button>
      </div>
      {toggleButtonState.isSelected ? (
        <ul>
          <li className="font-semibold">
            <ActiveLink
              href="/browse"
              anchorClassName={(isActive) =>
                `no-underline px-3 py-2 block focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 ${
                  isActive ? styles.activeSmallScreenLink : ''
                }`
              }
            >
              Browse
            </ActiveLink>
          </li>
          <li className="font-semibold">
            <ActiveLink
              href="/teams"
              anchorClassName={(isActive) =>
                `no-underline px-3 py-2 block focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 ${
                  isActive ? styles.activeSmallScreenLink : ''
                }`
              }
            >
              For teams
            </ActiveLink>
          </li>
          <li className="p-3">
            <div className="border-t border-gray-300" />
          </li>
          <li className="font-semibold mt-4 ml-2">
            <Link href="/content-models/new">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className={getButtonClassName({
                  color: 'primary',
                  size: 's',
                })}
              >
                Visualize content model
              </a>
            </Link>
          </li>
          <li className="p-3 flex items-center">
            {store.me === null ? (
              <div>
                <Button
                  variant="text"
                  size="s"
                  className="mt-3 mr-4"
                  onClick={() => {
                    router.push('/api/login');
                  }}
                >
                  Log in
                </Button>
                <Button
                  variant="text"
                  size="s"
                  className="mt-3 mr-2"
                  onClick={() => {
                    router.push('/api/signUp');
                  }}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center flex-wrap mt-3">
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
          {store.me !== null ? (
            <li className="font-semibold">
              <ActiveLink
                href="/profile/content-models"
                anchorClassName={(isActive) =>
                  `no-underline px-3 py-2 block focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 ${
                    isActive ? styles.activeSmallScreenLink : ''
                  }`
                }
              >
                My content models
              </ActiveLink>
            </li>
          ) : null}
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
            <img src={logo} alt="ContentModel.io logo" width="112" />
          </a>
        </Link>

        <ul className="flex items-center flex-grow">
          <li className="font-semibold">
            <ActiveLink
              href="/browse"
              anchorClassName={(isActive) =>
                `no-underline px-3 py-2 block focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 ${
                  isActive ? styles.activeLink : ''
                }`
              }
            >
              Browse
            </ActiveLink>
          </li>
          <li className="font-semibold">
            <ActiveLink
              href="/teams"
              anchorClassName={(isActive) =>
                `no-underline px-3 py-2 block focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 ${
                  isActive ? styles.activeLink : ''
                }`
              }
            >
              For teams
            </ActiveLink>
          </li>
          <li className="font-semibold ml-auto">
            <Link href="/content-models/new">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className={getButtonClassName({
                  color: 'primary',
                  size: 's',
                })}
              >
                Visualize content model
              </a>
            </Link>
          </li>
          <li
            className={`${
              store.me === null ? 'py-3' : 'py-2'
            } flex items-center ml-6`}
          >
            {store.me === null ? (
              <div>
                <Button
                  variant="text"
                  size="s"
                  grow={false}
                  className="mr-6"
                  onClick={() => {
                    router.push('/api/login');
                  }}
                >
                  Log in
                </Button>
                <Button
                  variant="text"
                  size="s"
                  grow={false}
                  onClick={() => {
                    router.push('/api/signUp');
                  }}
                >
                  Sign up
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
                    buttonClassName="w-10 h-10 appearance-none inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600"
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
    <header className="bg-sepia-100 border-b border-sepia-200 relative z-50">
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
