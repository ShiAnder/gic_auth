/**
 * An array of routes that are public and do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/client"

];


/**
 * An array of routes that are protected and require authentication.
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 * the prefix for the API Authentication routes
 * routes that start with this prefix are considered to be API Authentication routes
 * @type {string}
 * */
export const apiAuthPrefix = "/api/auth";


/**
 * 
 * default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
