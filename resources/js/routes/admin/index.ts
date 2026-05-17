import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mon-truck',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckAdminController::index
* @see app/Http/Controllers/TruckAdminController.php:16
* @route '/mon-truck'
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
* @see \App\Http\Controllers\TruckAdminController::claim
* @see app/Http/Controllers/TruckAdminController.php:123
* @route '/mon-truck/{truck}/revendiquer'
*/
export const claim = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(args, options),
    method: 'post',
})

claim.definition = {
    methods: ["post"],
    url: '/mon-truck/{truck}/revendiquer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TruckAdminController::claim
* @see app/Http/Controllers/TruckAdminController.php:123
* @route '/mon-truck/{truck}/revendiquer'
*/
claim.url = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { truck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { truck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            truck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        truck: typeof args.truck === 'object'
        ? args.truck.id
        : args.truck,
    }

    return claim.definition.url
            .replace('{truck}', parsedArgs.truck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckAdminController::claim
* @see app/Http/Controllers/TruckAdminController.php:123
* @route '/mon-truck/{truck}/revendiquer'
*/
claim.post = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TruckAdminController::claim
* @see app/Http/Controllers/TruckAdminController.php:123
* @route '/mon-truck/{truck}/revendiquer'
*/
const claimForm = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: claim.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TruckAdminController::claim
* @see app/Http/Controllers/TruckAdminController.php:123
* @route '/mon-truck/{truck}/revendiquer'
*/
claimForm.post = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: claim.url(args, options),
    method: 'post',
})

claim.form = claimForm

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
export const edit = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/mon-truck/{truck}/editer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
edit.url = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { truck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { truck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            truck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        truck: typeof args.truck === 'object'
        ? args.truck.id
        : args.truck,
    }

    return edit.definition.url
            .replace('{truck}', parsedArgs.truck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
edit.get = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
edit.head = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
const editForm = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
editForm.get = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TruckAdminController::edit
* @see app/Http/Controllers/TruckAdminController.php:36
* @route '/mon-truck/{truck}/editer'
*/
editForm.head = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\TruckAdminController::update
* @see app/Http/Controllers/TruckAdminController.php:67
* @route '/mon-truck/{truck}'
*/
export const update = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/mon-truck/{truck}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TruckAdminController::update
* @see app/Http/Controllers/TruckAdminController.php:67
* @route '/mon-truck/{truck}'
*/
update.url = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { truck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { truck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            truck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        truck: typeof args.truck === 'object'
        ? args.truck.id
        : args.truck,
    }

    return update.definition.url
            .replace('{truck}', parsedArgs.truck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckAdminController::update
* @see app/Http/Controllers/TruckAdminController.php:67
* @route '/mon-truck/{truck}'
*/
update.put = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TruckAdminController::update
* @see app/Http/Controllers/TruckAdminController.php:67
* @route '/mon-truck/{truck}'
*/
const updateForm = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TruckAdminController::update
* @see app/Http/Controllers/TruckAdminController.php:67
* @route '/mon-truck/{truck}'
*/
updateForm.put = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\TruckAdminController::destroy
* @see app/Http/Controllers/TruckAdminController.php:113
* @route '/mon-truck/{truck}'
*/
export const destroy = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/mon-truck/{truck}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TruckAdminController::destroy
* @see app/Http/Controllers/TruckAdminController.php:113
* @route '/mon-truck/{truck}'
*/
destroy.url = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { truck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { truck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            truck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        truck: typeof args.truck === 'object'
        ? args.truck.id
        : args.truck,
    }

    return destroy.definition.url
            .replace('{truck}', parsedArgs.truck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TruckAdminController::destroy
* @see app/Http/Controllers/TruckAdminController.php:113
* @route '/mon-truck/{truck}'
*/
destroy.delete = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TruckAdminController::destroy
* @see app/Http/Controllers/TruckAdminController.php:113
* @route '/mon-truck/{truck}'
*/
const destroyForm = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TruckAdminController::destroy
* @see app/Http/Controllers/TruckAdminController.php:113
* @route '/mon-truck/{truck}'
*/
destroyForm.delete = (args: { truck: string | { id: string } } | [truck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const admin = {
    index: Object.assign(index, index),
    claim: Object.assign(claim, claim),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default admin