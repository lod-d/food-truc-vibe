import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/cuisines',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CuisineController::index
* @see app/Http/Controllers/CuisineController.php:10
* @route '/api/cuisines'
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

const CuisineController = { index }

export default CuisineController