/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as GuestRouteImport } from './routes/_guest/route'
import { Route as AuthedRouteImport } from './routes/_authed/route'
import { Route as GuestIndexImport } from './routes/_guest/index'
import { Route as GuestRegisterImport } from './routes/_guest/register'
import { Route as AuthedGoalsImport } from './routes/_authed/goals'
import { Route as AuthedDashboardImport } from './routes/_authed/dashboard'
import { Route as AuthedBucketsImport } from './routes/_authed/buckets'
import { Route as AuthedExpensesIndexImport } from './routes/_authed/expenses/index'
import { Route as AuthedDistributionsIndexImport } from './routes/_authed/distributions/index'
import { Route as AuthedExpensesCreateImport } from './routes/_authed/expenses/create'
import { Route as AuthedDistributionsCreateImport } from './routes/_authed/distributions/create'
import { Route as AuthedDistributionsDistributionIdEditImport } from './routes/_authed/distributions/$distributionId/edit'

// Create/Update Routes

const GuestRouteRoute = GuestRouteImport.update({
  id: '/_guest',
  getParentRoute: () => rootRoute,
} as any)

const AuthedRouteRoute = AuthedRouteImport.update({
  id: '/_authed',
  getParentRoute: () => rootRoute,
} as any)

const GuestIndexRoute = GuestIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => GuestRouteRoute,
} as any)

const GuestRegisterRoute = GuestRegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => GuestRouteRoute,
} as any)

const AuthedGoalsRoute = AuthedGoalsImport.update({
  id: '/goals',
  path: '/goals',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedDashboardRoute = AuthedDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedBucketsRoute = AuthedBucketsImport.update({
  id: '/buckets',
  path: '/buckets',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedExpensesIndexRoute = AuthedExpensesIndexImport.update({
  id: '/expenses/',
  path: '/expenses/',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedDistributionsIndexRoute = AuthedDistributionsIndexImport.update({
  id: '/distributions/',
  path: '/distributions/',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedExpensesCreateRoute = AuthedExpensesCreateImport.update({
  id: '/expenses/create',
  path: '/expenses/create',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedDistributionsCreateRoute = AuthedDistributionsCreateImport.update({
  id: '/distributions/create',
  path: '/distributions/create',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedDistributionsDistributionIdEditRoute =
  AuthedDistributionsDistributionIdEditImport.update({
    id: '/distributions/$distributionId/edit',
    path: '/distributions/$distributionId/edit',
    getParentRoute: () => AuthedRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authed': {
      id: '/_authed'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthedRouteImport
      parentRoute: typeof rootRoute
    }
    '/_guest': {
      id: '/_guest'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof GuestRouteImport
      parentRoute: typeof rootRoute
    }
    '/_authed/buckets': {
      id: '/_authed/buckets'
      path: '/buckets'
      fullPath: '/buckets'
      preLoaderRoute: typeof AuthedBucketsImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/dashboard': {
      id: '/_authed/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthedDashboardImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/goals': {
      id: '/_authed/goals'
      path: '/goals'
      fullPath: '/goals'
      preLoaderRoute: typeof AuthedGoalsImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_guest/register': {
      id: '/_guest/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof GuestRegisterImport
      parentRoute: typeof GuestRouteImport
    }
    '/_guest/': {
      id: '/_guest/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof GuestIndexImport
      parentRoute: typeof GuestRouteImport
    }
    '/_authed/distributions/create': {
      id: '/_authed/distributions/create'
      path: '/distributions/create'
      fullPath: '/distributions/create'
      preLoaderRoute: typeof AuthedDistributionsCreateImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/expenses/create': {
      id: '/_authed/expenses/create'
      path: '/expenses/create'
      fullPath: '/expenses/create'
      preLoaderRoute: typeof AuthedExpensesCreateImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/distributions/': {
      id: '/_authed/distributions/'
      path: '/distributions'
      fullPath: '/distributions'
      preLoaderRoute: typeof AuthedDistributionsIndexImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/expenses/': {
      id: '/_authed/expenses/'
      path: '/expenses'
      fullPath: '/expenses'
      preLoaderRoute: typeof AuthedExpensesIndexImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/distributions/$distributionId/edit': {
      id: '/_authed/distributions/$distributionId/edit'
      path: '/distributions/$distributionId/edit'
      fullPath: '/distributions/$distributionId/edit'
      preLoaderRoute: typeof AuthedDistributionsDistributionIdEditImport
      parentRoute: typeof AuthedRouteImport
    }
  }
}

// Create and export the route tree

interface AuthedRouteRouteChildren {
  AuthedBucketsRoute: typeof AuthedBucketsRoute
  AuthedDashboardRoute: typeof AuthedDashboardRoute
  AuthedGoalsRoute: typeof AuthedGoalsRoute
  AuthedDistributionsCreateRoute: typeof AuthedDistributionsCreateRoute
  AuthedExpensesCreateRoute: typeof AuthedExpensesCreateRoute
  AuthedDistributionsIndexRoute: typeof AuthedDistributionsIndexRoute
  AuthedExpensesIndexRoute: typeof AuthedExpensesIndexRoute
  AuthedDistributionsDistributionIdEditRoute: typeof AuthedDistributionsDistributionIdEditRoute
}

const AuthedRouteRouteChildren: AuthedRouteRouteChildren = {
  AuthedBucketsRoute: AuthedBucketsRoute,
  AuthedDashboardRoute: AuthedDashboardRoute,
  AuthedGoalsRoute: AuthedGoalsRoute,
  AuthedDistributionsCreateRoute: AuthedDistributionsCreateRoute,
  AuthedExpensesCreateRoute: AuthedExpensesCreateRoute,
  AuthedDistributionsIndexRoute: AuthedDistributionsIndexRoute,
  AuthedExpensesIndexRoute: AuthedExpensesIndexRoute,
  AuthedDistributionsDistributionIdEditRoute:
    AuthedDistributionsDistributionIdEditRoute,
}

const AuthedRouteRouteWithChildren = AuthedRouteRoute._addFileChildren(
  AuthedRouteRouteChildren,
)

interface GuestRouteRouteChildren {
  GuestRegisterRoute: typeof GuestRegisterRoute
  GuestIndexRoute: typeof GuestIndexRoute
}

const GuestRouteRouteChildren: GuestRouteRouteChildren = {
  GuestRegisterRoute: GuestRegisterRoute,
  GuestIndexRoute: GuestIndexRoute,
}

const GuestRouteRouteWithChildren = GuestRouteRoute._addFileChildren(
  GuestRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof GuestRouteRouteWithChildren
  '/buckets': typeof AuthedBucketsRoute
  '/dashboard': typeof AuthedDashboardRoute
  '/goals': typeof AuthedGoalsRoute
  '/register': typeof GuestRegisterRoute
  '/': typeof GuestIndexRoute
  '/distributions/create': typeof AuthedDistributionsCreateRoute
  '/expenses/create': typeof AuthedExpensesCreateRoute
  '/distributions': typeof AuthedDistributionsIndexRoute
  '/expenses': typeof AuthedExpensesIndexRoute
  '/distributions/$distributionId/edit': typeof AuthedDistributionsDistributionIdEditRoute
}

export interface FileRoutesByTo {
  '': typeof AuthedRouteRouteWithChildren
  '/buckets': typeof AuthedBucketsRoute
  '/dashboard': typeof AuthedDashboardRoute
  '/goals': typeof AuthedGoalsRoute
  '/register': typeof GuestRegisterRoute
  '/': typeof GuestIndexRoute
  '/distributions/create': typeof AuthedDistributionsCreateRoute
  '/expenses/create': typeof AuthedExpensesCreateRoute
  '/distributions': typeof AuthedDistributionsIndexRoute
  '/expenses': typeof AuthedExpensesIndexRoute
  '/distributions/$distributionId/edit': typeof AuthedDistributionsDistributionIdEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authed': typeof AuthedRouteRouteWithChildren
  '/_guest': typeof GuestRouteRouteWithChildren
  '/_authed/buckets': typeof AuthedBucketsRoute
  '/_authed/dashboard': typeof AuthedDashboardRoute
  '/_authed/goals': typeof AuthedGoalsRoute
  '/_guest/register': typeof GuestRegisterRoute
  '/_guest/': typeof GuestIndexRoute
  '/_authed/distributions/create': typeof AuthedDistributionsCreateRoute
  '/_authed/expenses/create': typeof AuthedExpensesCreateRoute
  '/_authed/distributions/': typeof AuthedDistributionsIndexRoute
  '/_authed/expenses/': typeof AuthedExpensesIndexRoute
  '/_authed/distributions/$distributionId/edit': typeof AuthedDistributionsDistributionIdEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/buckets'
    | '/dashboard'
    | '/goals'
    | '/register'
    | '/'
    | '/distributions/create'
    | '/expenses/create'
    | '/distributions'
    | '/expenses'
    | '/distributions/$distributionId/edit'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/buckets'
    | '/dashboard'
    | '/goals'
    | '/register'
    | '/'
    | '/distributions/create'
    | '/expenses/create'
    | '/distributions'
    | '/expenses'
    | '/distributions/$distributionId/edit'
  id:
    | '__root__'
    | '/_authed'
    | '/_guest'
    | '/_authed/buckets'
    | '/_authed/dashboard'
    | '/_authed/goals'
    | '/_guest/register'
    | '/_guest/'
    | '/_authed/distributions/create'
    | '/_authed/expenses/create'
    | '/_authed/distributions/'
    | '/_authed/expenses/'
    | '/_authed/distributions/$distributionId/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthedRouteRoute: typeof AuthedRouteRouteWithChildren
  GuestRouteRoute: typeof GuestRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AuthedRouteRoute: AuthedRouteRouteWithChildren,
  GuestRouteRoute: GuestRouteRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authed",
        "/_guest"
      ]
    },
    "/_authed": {
      "filePath": "_authed/route.tsx",
      "children": [
        "/_authed/buckets",
        "/_authed/dashboard",
        "/_authed/goals",
        "/_authed/distributions/create",
        "/_authed/expenses/create",
        "/_authed/distributions/",
        "/_authed/expenses/",
        "/_authed/distributions/$distributionId/edit"
      ]
    },
    "/_guest": {
      "filePath": "_guest/route.tsx",
      "children": [
        "/_guest/register",
        "/_guest/"
      ]
    },
    "/_authed/buckets": {
      "filePath": "_authed/buckets.tsx",
      "parent": "/_authed"
    },
    "/_authed/dashboard": {
      "filePath": "_authed/dashboard.tsx",
      "parent": "/_authed"
    },
    "/_authed/goals": {
      "filePath": "_authed/goals.tsx",
      "parent": "/_authed"
    },
    "/_guest/register": {
      "filePath": "_guest/register.tsx",
      "parent": "/_guest"
    },
    "/_guest/": {
      "filePath": "_guest/index.tsx",
      "parent": "/_guest"
    },
    "/_authed/distributions/create": {
      "filePath": "_authed/distributions/create.tsx",
      "parent": "/_authed"
    },
    "/_authed/expenses/create": {
      "filePath": "_authed/expenses/create.tsx",
      "parent": "/_authed"
    },
    "/_authed/distributions/": {
      "filePath": "_authed/distributions/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/expenses/": {
      "filePath": "_authed/expenses/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/distributions/$distributionId/edit": {
      "filePath": "_authed/distributions/$distributionId/edit.tsx",
      "parent": "/_authed"
    }
  }
}
ROUTE_MANIFEST_END */
