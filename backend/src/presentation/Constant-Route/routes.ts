

export const ROUTES={
    AUTH:{
        SIGNUP:'/signup',
        LOGIN:'/login',
        LOGOUT:'/logout',
        REFRESH_TOKEN:'/refresh-token',
        VERIFY_OTP:'/verify-otp',
        FORGOT_PASSWORD:'/forgot-password',
        RESET_PASSWORD:'/reset-password',
        RESEND_OTP:'/resend-otp',
        GOOGLE:'/auth/google',
        GOOGLE_CALLBACK:'/auth/google/callback',
        GOOGLE_FAILURE:'/auth/google/failure',
    },
    AUCTION:{
        CREATE:'/',
        GET_MINE:'/all-auctions',
        GET_ALL:'/',
        GET_DETAILS:'/:id',
        UPDATE:'/:id',
        START_LIVE:'/:id/start',
        END_LIVE:'/:id/end',
        CANCEL_LIVE:'/:id/cancel',
        REQUEST_CANCELLATION:'/:id/request-cancel',
    },
    USER:{
        //Profile
        PROFILE_GET:'/user-profile',
        PROFILE_UPDATE:'/user-profile',
        PROFILE_CHANGE_PASSWORD:'/change-password'
    },
    ADDRESS:{
        ADDRESS_GET:'/address',
        ADDRESS_ADD:'/address',
        ADDRESS_UPDATE:'/address/:id',
        ADDRESS_DELETE:'/address/:id',
        ADDRESS_SET_DEFAULT:'/address/:id/default',
    },
    BID:{
        BID_PLACE:'/',
        BID_GET_MINE:'/my-bids',
        BID_GET_AUCTION:'/:auctionId',
    },
    WALLET:{
        GET_WALLET:'/getwallet',
        CREATE_PAYMENT:'/payment',
        CONFIRM_PAYMENT:'/payment/confirm',
    },

    ADMIN:{
        GET_USERS:'/users',
        BLOCK_USER:'/users/:userId/block',

        DELETE_AUCTION:'/auctions/:id',
        UPDATE_AUCTION_STATUS:'/auctions/:id/status',

        ADMIN_RELEASE_PAYMENT:'/release/payments',


        CATEGORY_CREATE:'/',
        CATEGORY_GET_ALL:'/',
        CATEGORY_UPDATE:'/:id',
        CATEGORY_DELETE:'/:id',
    },
    SUBSCRIPTION:{
        // PLAN OF ADMIN
        CREATE_PLAN:'/create-subscription',
        GET_ALL_PLAN:'/subcriptionplans',
        UPDATE_PLAN:'/subcriptionplans/:id',
        DELETE_PLAN:'/subcriptionplans/:id',

        // user-Subscriptions
        USER_PLAN_GET:'/plans',
        USER_SUBSCRIPTION_GET:'/user-subscription',
        USER_SUBSCRIBE:'/user-subscribe',
        CREATE_PAYMENT_INTENT:'/create-payment-intent',
        CONFIRM_PAYMENT:'/confirm-payment'
    },
    COMMON:{
        WEBHOOK:'/stripe',
        UPLOAD:'/'
    },
    Watchlist:{
        WATCHLIST_GET:'/watchlist',
        WATCHLIST_ADD:'/watchlist/:auctionId',
        WATCHLIST_REMOVE:'/watchlist/:auctionId',
        WATCHLIST_CHECK:'/watchlist/:auctionId/check'
    }

}