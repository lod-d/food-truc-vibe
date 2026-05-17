import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/enregistrer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::create
* @see app/Http/Controllers/TruckController.php:95
* @route '/enregistrer'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\TruckController::store
* @see app/Http/Controllers/TruckController.php:100
* @route '/trucks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trucks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TruckController::store
* @see app/Http/Controllers/TruckController.php:100
* @route '/trucks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckController::store
* @see app/Http/Controllers/TruckController.php:100
* @route '/trucks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TruckController::store
* @see app/Http/Controllers/TruckController.php:100
* @route '/trucks'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TruckController::store
* @see app/Http/Controllers/TruckController.php:100
* @route '/trucks'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const trucks = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
}

export default trucks