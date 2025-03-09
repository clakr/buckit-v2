/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RegisterImport } from './routes/register'
import { Route as AuthedRouteImport } from './routes/_authed/route'
import { Route as IndexImport } from './routes/index'
import { Route as AuthedDashboardImport } from './routes/_authed/dashboard'
import { Route as AuthedBucketsIndexImport } from './routes/_authed/buckets/index'
import { Route as AuthedBucketsCreateImport } from './routes/_authed/buckets/create'

// Create/Update Routes

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const AuthedRouteRoute = AuthedRouteImport.update({
  id: '/_authed',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthedDashboardRoute = AuthedDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedBucketsIndexRoute = AuthedBucketsIndexImport.update({
  id: '/buckets/',
  path: '/buckets/',
  getParentRoute: () => AuthedRouteRoute,
} as any)

const AuthedBucketsCreateRoute = AuthedBucketsCreateImport.update({
  id: '/buckets/create',
  path: '/buckets/create',
  getParentRoute: () => AuthedRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authed': {
      id: '/_authed'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthedRouteImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/_authed/dashboard': {
      id: '/_authed/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthedDashboardImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/buckets/create': {
      id: '/_authed/buckets/create'
      path: '/buckets/create'
      fullPath: '/buckets/create'
      preLoaderRoute: typeof AuthedBucketsCreateImport
      parentRoute: typeof AuthedRouteImport
    }
    '/_authed/buckets/': {
      id: '/_authed/buckets/'
      path: '/buckets'
      fullPath: '/buckets'
      preLoaderRoute: typeof AuthedBucketsIndexImport
      parentRoute: typeof AuthedRouteImport
    }
  }
}

// Create and export the route tree

interface AuthedRouteRouteChildren {
  AuthedDashboardRoute: typeof AuthedDashboardRoute
  AuthedBucketsCreateRoute: typeof AuthedBucketsCreateRoute
  AuthedBucketsIndexRoute: typeof AuthedBucketsIndexRoute
}

const AuthedRouteRouteChildren: AuthedRouteRouteChildren = {
  AuthedDashboardRoute: AuthedDashboardRoute,
  AuthedBucketsCreateRoute: AuthedBucketsCreateRoute,
  AuthedBucketsIndexRoute: AuthedBucketsIndexRoute,
}

const AuthedRouteRouteWithChildren = AuthedRouteRoute._addFileChildren(
  AuthedRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthedRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/dashboard': typeof AuthedDashboardRoute
  '/buckets/create': typeof AuthedBucketsCreateRoute
  '/buckets': typeof AuthedBucketsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthedRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/dashboard': typeof AuthedDashboardRoute
  '/buckets/create': typeof AuthedBucketsCreateRoute
  '/buckets': typeof AuthedBucketsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_authed': typeof AuthedRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/_authed/dashboard': typeof AuthedDashboardRoute
  '/_authed/buckets/create': typeof AuthedBucketsCreateRoute
  '/_authed/buckets/': typeof AuthedBucketsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/register'
    | '/dashboard'
    | '/buckets/create'
    | '/buckets'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/register' | '/dashboard' | '/buckets/create' | '/buckets'
  id:
    | '__root__'
    | '/'
    | '/_authed'
    | '/register'
    | '/_authed/dashboard'
    | '/_authed/buckets/create'
    | '/_authed/buckets/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthedRouteRoute: typeof AuthedRouteRouteWithChildren
  RegisterRoute: typeof RegisterRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthedRouteRoute: AuthedRouteRouteWithChildren,
  RegisterRoute: RegisterRoute,
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
        "/",
        "/_authed",
        "/register"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_authed": {
      "filePath": "_authed/route.tsx",
      "children": [
        "/_authed/dashboard",
        "/_authed/buckets/create",
        "/_authed/buckets/"
      ]
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/_authed/dashboard": {
      "filePath": "_authed/dashboard.tsx",
      "parent": "/_authed"
    },
    "/_authed/buckets/create": {
      "filePath": "_authed/buckets/create.tsx",
      "parent": "/_authed"
    },
    "/_authed/buckets/": {
      "filePath": "_authed/buckets/index.tsx",
      "parent": "/_authed"
    }
  }
}
ROUTE_MANIFEST_END */
