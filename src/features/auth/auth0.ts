import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  issuerBaseURL: process.env.AUTH0_BASE_URL || '',
  clientID: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
  routes: {
    callback: '/api/callback',
    postLogoutRedirect: '/',
  },
  secret: process.env.AUTH0_COOKIE_SECRET || undefined,
  session: {
    rollingDuration: 60 * 60 * 24,
    absoluteDuration: 60 * 60 * 24 * 7,
  },
});
