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
import { Route as AuthedGoalsImport } from './routes/_authed/goals'
import { Route as AuthedDashboardImport } from './routes/_authed/dashboard'
import { Route as AuthedBucketsImport } from './routes/_authed/buckets'

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
  }
}

// Create and export the route tree

interface AuthedRouteRouteChildren {
  AuthedBucketsRoute: typeof AuthedBucketsRoute
  AuthedDashboardRoute: typeof AuthedDashboardRoute
  AuthedGoalsRoute: typeof AuthedGoalsRoute
}

const AuthedRouteRouteChildren: AuthedRouteRouteChildren = {
  AuthedBucketsRoute: AuthedBucketsRoute,
  AuthedDashboardRoute: AuthedDashboardRoute,
  AuthedGoalsRoute: AuthedGoalsRoute,
}

const AuthedRouteRouteWithChildren = AuthedRouteRoute._addFileChildren(
  AuthedRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthedRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/buckets': typeof AuthedBucketsRoute
  '/dashboard': typeof AuthedDashboardRoute
  '/goals': typeof AuthedGoalsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthedRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/buckets': typeof AuthedBucketsRoute
  '/dashboard': typeof AuthedDashboardRoute
  '/goals': typeof AuthedGoalsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_authed': typeof AuthedRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/_authed/buckets': typeof AuthedBucketsRoute
  '/_authed/dashboard': typeof AuthedDashboardRoute
  '/_authed/goals': typeof AuthedGoalsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/register' | '/buckets' | '/dashboard' | '/goals'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/register' | '/buckets' | '/dashboard' | '/goals'
  id:
    | '__root__'
    | '/'
    | '/_authed'
    | '/register'
    | '/_authed/buckets'
    | '/_authed/dashboard'
    | '/_authed/goals'
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
        "/_authed/buckets",
        "/_authed/dashboard",
        "/_authed/goals"
      ]
    },
    "/register": {
      "filePath": "register.tsx"
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
    }
  }
}
ROUTE_MANIFEST_END */
