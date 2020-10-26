import { types } from 'mobx-state-tree'
// @ts-ignore
import route from 'path-match'

const viewModel = types.optional(
  types
    .model({
      page: '',
      id: types.maybeNull(types.number)
    })
    .views(self => ({
      get currentURL() {
        switch (self.page) {
          case '':
          case '/':
            return '/'
          case '/something-else':
            return '/something-else'
          default:
            return '/404'
        }
      }
    }))
    .actions(self => ({
      openHomepage: () => (self.page = '/'),
      openSomethingElse: () => (self.page = '/something-else')
    })),
  { page: '/' }
)

interface IRoutes {
  [routeName: string]: Function
}

// todo: DRY
const routeMap: (view: any) => IRoutes = view => ({
  '/': view.openHomepage,
  '/something-else': view.openSomethingElse
})

function createRouter(routes: IRoutes) {
  const matchers = Object.keys(routes).map(path => [
    route()(path),
    routes[path]
  ])
  return function (path: string) {
    return matchers.some(([matcher, f]) => {
      const result = matcher(path)
      if (result === false) return false
      f(result)
      return true
    })
  }
}

export { routeMap, createRouter, viewModel as default }