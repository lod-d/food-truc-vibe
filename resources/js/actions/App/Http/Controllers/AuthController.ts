import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
export const showLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

showLogin.definition = {
    methods: ["get","head"],
    url: '/connexion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
showLogin.url = (options?: RouteQueryOptions) => {
    return showLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
showLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
showLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLogin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
const showLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showLogin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
showLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showLogin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:15
* @route '/connexion'
*/
showLoginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showLogin.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showLogin.form = showLoginForm

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:20
* @route '/connexion'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/connexion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:20
* @route '/connexion'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:20
* @route '/connexion'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:20
* @route '/connexion'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:20
* @route '/connexion'
*/
loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

login.form = loginForm

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
export const showRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

showRegister.definition = {
    methods: ["get","head"],
    url: '/inscription',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
showRegister.url = (options?: RouteQueryOptions) => {
    return showRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
showRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
showRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRegister.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
const showRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showRegister.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
showRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showRegister.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:37
* @route '/inscription'
*/
showRegisterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showRegister.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showRegister.form = showRegisterForm

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:42
* @route '/inscription'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/inscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:42
* @route '/inscription'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:42
* @route '/inscription'
*/
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:42
* @route '/inscription'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:42
* @route '/inscription'
*/
registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

register.form = registerForm

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:68
* @route '/deconnexion'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/deconnexion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:68
* @route '/deconnexion'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:68
* @route '/deconnexion'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:68
* @route '/deconnexion'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:68
* @route '/deconnexion'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

const AuthController = { showLogin, login, showRegister, register, logout }

export default AuthController