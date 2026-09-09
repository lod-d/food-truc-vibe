import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, DefineComponent, h } from 'vue';

const pages = import.meta.glob<DefineComponent>('./pages/**/*.vue', { eager: true });

createServer((page: any) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name: string) => {
            const component = pages[`./pages/${name}.vue`];
            if (!component) throw new Error(`Page introuvable : ${name}`);
            return component;
        },
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) }).use(plugin);
        },
    }),
);
