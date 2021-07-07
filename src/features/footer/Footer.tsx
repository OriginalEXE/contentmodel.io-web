import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sepia-100 dark:bg-gray-800 border-t border-sepia-200 dark:border-gray-900 mt-auto">
      <div className="w-full mx-auto px-3 py-6 lg:pb-12">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between">
          <div className="w-full lg:w-4/12 lg:mt-6 lg:mr-3">
            <p className="text-base">
              Created by{' '}
              <a
                href="https://twitter.com/antesepic"
                className="text-blue-500 dark:text-blue-400"
              >
                @antesepic
              </a>{' '}
            </p>
            <p className="text-sm mt-3">
              ContentModel.io is a community project. Contentful GmbH is not
              affiliated with ContentModel.io
            </p>
          </div>

          <nav
            className="mt-6 w-full flex flex-wrap lg:w-7/12 lg:mt-0"
            aria-label="footer links"
          >
            <ul className="w-full mt-6 sm:w-64 sm:mr-3">
              <li className="text-base font-semibold text-sepia-900 dark:text-gray-200">
                Useful links
              </li>

              <li className="mt-2">
                <a
                  href="https://www.contentful.com/slack/"
                  className="text-base text-sepia-700 dark:text-blue-400"
                >
                  Contentful community Slack
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://github.com/OriginalEXE/contentmodel.io-web/discussions"
                  className="text-base text-sepia-700 dark:text-blue-400"
                >
                  Feedback, roadmap, discussions on Github
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://github.com/OriginalEXE/contentmodel.io-web"
                  className="text-base text-sepia-700 dark:text-blue-400"
                >
                  GitHub repository
                </a>
              </li>
            </ul>

            <ul className="w-full mt-6 sm:w-64">
              <li className="text-base font-semibold text-sepia-900 dark:text-gray-200">
                Legal
              </li>
              <li className="mt-2">
                <Link href="/legal/privacy-policy">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="text-base text-sepia-700 dark:text-blue-400">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li className="mt-2">
                <Link href="/legal/terms-and-conditions">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="text-base text-sepia-700 dark:text-blue-400">
                    Terms and Conditions
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
