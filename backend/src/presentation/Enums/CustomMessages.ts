

export enum CustomMessages {
    VERIFIED = "Verified",
    OTP_SENT = "OTP Send to Mail",
    PASSWORD_CHANGED = "Password changed successfully",
    REFRESH_TOKEN_REQUIRED = "Refresh token required",
    LOGIN_SUCCESS = "Login successful",
    SIGNUP_SUCCESS = "Signup successful",
    INVALID_CREDENTIALS = "Invalid credentials",
    USER_NOT_FOUND = "User not found",
    EMAIL_ALREADY_EXISTS = "Email already exists",
    NO_TOKEN_PROVIDED = "No token provided",
    LOG_OUT = "Logged out successfully",

    OTP_INVALID = 'Invalid OTP',
    OTP_EXPIRED = 'OTP has expired',
    OTP_INVALID_OR_EXPIRED = 'Invalid or expired OTP',
    USER_BLOCKED = 'Your account has been blocked',
    INVALID_PASSWORD = 'Invalid password',
    INVALID_REFRESH_TOKEN = 'Invalid refresh token',
    REFRESH_TOKEN_REVOKED = 'Refresh token has been revoked or is invalid',
    INVALID_GOOGLE_TOKEN = 'Invalid Google authentication token',
    USER_ALREADY_EXISTS = 'User already exists',

    // ── Authorization-section
    UNAUTHORIZED = 'Unauthorized',
    ACCESS_DENIED = 'Access denied. No token provided',
    TOKEN_INVALID_OR_EXPIRED = 'Invalid or expired token',
    USER_IS_BLOCKED = 'Your account has been suspended',

    // ── Auction-Section

    AUCTION_CREATED = 'Auction created successfully',
    AUCTION_UPDATED = 'Auction updated successfully',
    AUCTION_DELETED = 'Auction deleted successfully',
    AUCTION_FETCHED = 'Auction fetched successfully',
    AUCTION_NOT_FOUND = 'Auction not found',
    AUCTION_STATUS_UPDATED = 'Auction status updated successfully',
    LIVE_AUCTION_STARTED = 'Live auction started successfully',
    LIVE_AUCTION_ENDED = 'Auction ended successfully',
    LIVE_AUCTION_CANCELLED = 'Auction cancelled successfully',
    CANCELLATION_REQUESTED = 'Cancellation request submitted successfully',
    NO_SUBSCRIPTION = 'No active subscription plan found',
    AUCTION_LIMIT_EXCEEDED = 'Auction limit exceeded for your subscription plan',
    AUCTION_DURATION_EXCEEDED = 'Auction duration exceeds your plan limit',
    LIVE_NOT_ALLOWED = 'Live auctions are not available on your current plan',
    LIVE_DURATION_EXCEEDED = 'Live auction cannot exceed 2 hours in duration',

    //  Live Auction-Section

    NOT_LIVE_AUCTION = 'This is not a live auction',
    AUCTION_ALREADY_LIVE = 'Auction is already live',
    ONLY_SELLER_CAN_START = 'Only the seller can start this auction',
    ONLY_SELLER_CAN_END = 'Only the seller can end this auction',
    ONLY_ADMIN_CAN_CANCEL = 'Only an admin can cancel a live auction',
    AUCTION_NOT_ACTIVE = 'Only active auctions can be cancelled',
    NOT_AUCTION_OWNER = 'You are not the owner of this auction',

    // Category-Section

    CATEGORY_FETCHED = 'Categories fetched successfully',
    CATEGORY_CREATED = 'Category created successfully',
    CATEGORY_UPDATED = 'Category updated successfully',
    CATEGORY_DELETED = 'Category deleted successfully',
    CATEGORY_NOT_FOUND = 'Category not found',
    CATEGORY_NOT_FOUND_OR_DELETED = 'Category not found or may have already been deleted',

    // Address-Section

    ADDRESSES_FETCHED = 'Addresses fetched successfully',
    ADDRESS_ADDED = 'Address added successfully',
    ADDRESS_UPDATED = 'Address updated successfully',
    ADDRESS_DELETED = 'Address deleted successfully',
    ADDRESS_NOT_FOUND = 'Address not found',
    ADDRESS_DEFAULT_UPDATED = 'Default address updated',

    // Profile-Section

    PROFILE_FETCHED = 'Profile fetched successfully',
    PROFILE_UPDATED = 'Profile updated successfully',
    INCORRECT_PASSWORD = 'Current password is incorrect',

    // Subscription Plan 

    PLAN_FETCHED = 'Subscription plan fetched successfully',
    PLANS_FETCHED = 'Subscription plans fetched successfully',
    PLAN_CREATED = 'Subscription plan created successfully',
    PLAN_UPDATED = 'Subscription plan updated successfully',
    PLAN_DELETED = 'Subscription plan deleted successfully',
    PLAN_NOT_FOUND = 'Subscription plan not found',
    PLAN_NOT_FOUND_OR_DELETED = 'Plan not found or may have already been deleted',
    PLAN_NAME_REQUIRED = 'Plan name is required',
    PLAN_PRICE_NEGATIVE = 'Price cannot be negative',
    PLAN_DURATION_INVALID = 'Duration must be between 1 and 365 days',
    PLAN_AUCTIONS_INVALID = 'Auctions per year must be a positive number',
    PLAN_COMMISSION_INVALID = 'Commission must be between 0% and 100%',
    PLAN_NAME_DUPLICATE = 'A plan with this name already exists',

    // Subscription-Section

    SUBSCRIPTION_FETCHED = 'Subscription fetched successfully',
    SUBSCRIPTION_CREATED = 'Subscription created successfully',
    SUBSCRIPTION_ACTIVATED = 'Subscription activated successfully',
    INVALID_PLAN = 'Invalid subscription plan',
    PLAN_ID_NAME_REQUIRED = 'Plan ID and plan name are required',
    PAYMENT_INTENT_REQUIRED = 'Payment intent ID, plan ID, and plan name are required',
    UPGRADE_ONLY = 'You can only upgrade to a higher subscription plan',
    ALREADY_SUBSCRIBED = 'You already have an equal or higher active subscription',
    PAYMENT_VERIFICATION_FAILED = 'Payment verification failed',
    PAYMENT_INTENT_CREATED = 'Payment intent created successfully',

    // Wallet-Section

    WALLET_FETCHED = 'Wallet fetched successfully',
    TRANSACTIONS_FETCHED = 'Transactions fetched successfully',
    PAYMENT_CONFIRMED = 'Payment confirmed',
    PAYMENT_STATUS_FAILED = 'Payment did not succeed',
    PAYOUT_ALREADY_DONE = 'Payout already in progress or completed',
    PAYMENT_RELEASED = 'Payment released to seller',
    ADMIN_WALLET_NOT_FOUND = 'Admin wallet not found',
    ADMIN_NOT_FOUND = 'Admin account not found',
    SELLER_WALLET_NOT_FOUND = 'Seller wallet not found',
    PENDING_RELEASE_FETCHED = 'Pending release items fetched',

    // Watchlist─Section

    ADDED_TO_WATCHLIST = 'Added to watchlist',
    REMOVED_FROM_WATCHLIST = 'Removed from watchlist',
    WATCHLIST_FETCHED = 'Watchlist fetched successfully',
    WATCHLIST_STATUS_CHECKED = 'Watchlist status checked',

    // Review-Section

    REVIEW_ADDED = 'Review added successfully',
    REVIEWS_FETCHED = 'Reviews fetched successfully',
    REVIEW_SOLD_ONLY = 'Reviews can only be added for sold auctions',
    REVIEW_BUYER_ONLY = 'Only the winning buyer can leave a review',
    REVIEW_ALREADY_SUBMITTED = 'You have already submitted a review for this auction',

    // Dispute─Section

    DELIVERY_CONFIRMED = 'Delivery confirmed. Funds have been released to the seller.',
    DISPUTE_RAISED = 'Dispute raised successfully. Funds are locked pending review.',
    DISPUTE_RESOLVED = 'Dispute resolved successfully',
    DISPUTE_NOT_FOUND = 'Dispute not found',
    DISPUTE_ALREADY_RESOLVED = 'This dispute has already been resolved',
    DISPUTE_ONLY_BUYER = 'Only the winning buyer can raise a dispute',
    DISPUTE_PAYMENT_INCOMPLETE = 'Payment must be completed before raising a dispute',
    DISPUTE_WRONG_DELIVERY = 'A dispute cannot be raised at the current delivery status',
    DISPUTE_ALREADY_RAISED = 'A dispute has already been raised for this auction',
    ESCROW_NOT_FOUND_REFUND = 'Escrow transaction not found — cannot process refund',
    ESCROW_NOT_FOUND_RELEASE = 'Escrow transaction not found — cannot release funds',

    // Notification-Section

    NOTIFICATIONS_FETCHED = 'Notifications fetched successfully',
    NOTIFICATIONS_MARKED_READ = 'Notifications marked as read',

    // Bid─Section

    BID_PLACED = 'Bid placed successfully',
    BIDS_FETCHED = 'Bids fetched successfully',

    //Upload─Section

    FILE_UPLOADED = 'File uploaded successfully',
    NO_FILE_UPLOADED = 'No file was uploaded',
    MAX_IMAGES_EXCEEDED = 'Maximum 5 images allowed',
    IMAGE_UPLOAD_FAILED = 'Image upload failed',
    USERS_FETCHED = 'Users fetched successfully',
    USER_BLOCKED_MSG = 'User blocked successfully',
    USER_UNBLOCKED_MSG = 'User unblocked successfully',
    STATS_FETCHED = 'Dashboard statistics fetched successfully',
    DISPUTES_FETCHED = 'Disputes fetched successfully',


}