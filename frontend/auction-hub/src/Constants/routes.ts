export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  AUTH_CALLBACK: '/auth/callback',
  AUCTIONS: '/auctions',
  AUCTION_DETAILS: '/auction/:id',
  WATCHLIST: '/watchlist',
  SUBSCRIPTION_PLANS: '/subscription-plans',
  LIVE_AUCTION: '/live-auction/:id',

  USER: {
    DASHBOARD: '/user/dashboard',
    MY_BIDS: '/user/my-bids',
    MY_LISTINGS: '/user/my-listings',
    PROFILE: '/user/profile',
  },

  ADMIN: {
    LOGIN: '/admin/login',
    LAYOUT: '/admin',
    DASHBOARD: 'dashboard',
    USERS: 'users',
    CATEGORIES: 'categories',
    AUCTIONS: 'auctions',
    WALLET: 'wallet',
    SUBSCRIPTIONS: 'subscription-plans',
    DISPUTES: 'disputes',
  }
};
