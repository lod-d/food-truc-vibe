import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
export const checkName = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkName.url(options),
    method: 'get',
})

checkName.definition = {
    methods: ["get","head"],
    url: '/api/trucks/check-name',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
checkName.url = (options?: RouteQueryOptions) => {
    return checkName.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
checkName.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkName.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
checkName.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkName.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
const checkNameForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkName.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
checkNameForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkName.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::checkName
* @see app/Http/Controllers/TruckController.php:82
* @route '/api/trucks/check-name'
*/
checkNameForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkName.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkName.form = checkNameForm

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/trucks/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::show
* @see app/Http/Controllers/TruckController.php:74
* @route '/api/trucks/{id}'
*/
showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/trucks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckController::index
* @see app/Http/Controllers/TruckController.php:21
* @route '/api/trucks'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

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

const TruckController = { checkName, show, index, create, store }

export default TruckController