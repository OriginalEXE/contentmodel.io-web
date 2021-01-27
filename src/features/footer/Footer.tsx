import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sepia-100 border-t border-sepia-200 mt-auto">
      <div className="w-full mx-auto px-3 py-6 lg:pb-12">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between">
          <div className="w-full lg:w-2/6 lg:mt-6">
            <p className="text-base">
              Created by{' '}
              <a href="https://twitter.com/antesepic" className="text-blue-500">
                @antesepic
              </a>{' '}
            </p>
          </div>

          <nav className="mt-6 w-full flex flex-wrap lg:w-4/6 lg:mt-0">
            <ul className="w-full mt-6 sm:w-64 sm:mr-3">
              <li className="text-base font-semibold text-sepia-900">
                Interesting links
              </li>

              <li className="mt-2">
                <a
                  href="https://www.contentful.com/slack/"
                  className="text-base text-sepia-700"
                >
                  Contentful community Slack
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://github.com/OriginalEXE/contentmodel.io-web/discussions"
                  className="text-base text-sepia-700"
                >
                  Feedback, roadmap, discussions on Github
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://github.com/OriginalEXE/contentmodel.io-web"
                  className="text-base text-sepia-700"
                >
                  GitHub repository
                </a>
              </li>
            </ul>

            <ul className="w-full mt-6 sm:w-64">
              <li className="text-base font-semibold text-sepia-900">Legal</li>
              <li className="mt-2">
                <Link href="/legal/privacy-policy">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="text-base text-sepia-700">Privacy Policy</a>
                </Link>
              </li>
              <li className="mt-2">
                <Link href="/legal/terms-and-conditions">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="text-base text-sepia-700">
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
