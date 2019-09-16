export const AUTH_CONFIG = {
  domain: 'hasura-sample-apps.auth0.com',
  clientId: 'H12W606vk4VHKa55iCwWhfbqa8A7ZAxS',
  callbackUrl: process.env.NODE_ENV === 'production' ? process.env.AUTH_CALLBACK_URL : 'http://localhost:3000/callback',
  afterLogout: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_LOGOUT_URL : 'http://localhost:3000'
};
