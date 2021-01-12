import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  domain: process.env.AUTH0_DOMAIN || '',
  clientId: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  scope: 'openid profile email',
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
  postLogoutRedirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  session: {
    cookieSecret: process.env.AUTH0_COOKIE_SECRET || '',
    cookieLifetime: 60 * 60 * 24 * 7,
    cookieSameSite: 'lax',
    storeIdToken: true,
    storeAccessToken: true,
    storeRefreshToken: true,
  },
});
