import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/config',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/config',
                name: 'Config',
                meta: {
                    title: '配置管理',
                    permiss: '1',
                },
                component: () => import('../views/config.vue'),
            },
            {
                path: '/jmx',
                name: 'Jmx',
                meta: {
                    title: '脚本管理',
                    permiss: '1',
                },
                component: () => import('../views/jmx.vue'),
            },
            {
                path: '/node',
                name: 'Node',
                meta: {
                    title: '节点管理',
                    permiss: '1',
                },
                component: () => import('../views/node.vue'),
            },
            {
                path: '/user',
                name: 'User',
                meta: {
                    title: '用户管理',
                    permiss: '1',
                },
                component: () => import('../views/user.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | mysterious`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
