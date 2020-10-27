import { Instance, destroy } from 'mobx-state-tree'
import { RootStoreBase } from './RootStore.base'
import viewModel from './view'
import loggedInUser from './loggedInUser'
import { localStorageMixin } from 'mst-gql'

export interface RootStoreType extends Instance<typeof RootStore.Type> {}

export const RootStore = RootStoreBase.props({
  view: viewModel,
  loggedInUser
})
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    },

    login({ email, password }: { email: string; password: string }) {
      const query = self.mutateLogin({ email, password }, s =>
        s.accessToken.user()
      )
      query.then(
        data =>
          (self.loggedInUser = loggedInUser.create({
            accessToken: data.login.accessToken!,
            id: data.login.user.id
          })),
        error => console.error(error)
      )
      return query
    },

    logout() {
      self.loggedInUser && destroy(self.loggedInUser)
    }
  }))
  .extend(localStorageMixin({ filter: ['loggedInUser'] }))
