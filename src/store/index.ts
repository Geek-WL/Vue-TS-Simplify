import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roles: [],
    permissionList: [],
    leaderPermission: ['users:query', 'users:exportRes', 'users:addUser', 'users:importUser', 'users:exportAllUser', 'users:editUser', 'users:deleteUser', 'users:assignRole','roles:addRole', 'roles:editRole', 'roles:deleteRole', 'roles:assignRight', 'roles:sureRight', 'rights:addRight', 'rights:editRight','rights:deleteRight', 'rights:checkRight', 'users:status', 'roles:status', 'rights:status'],
    managerPermission: ['users:query', 'users:exportRes', 'users:addUser', 'users:importUser', 'users:exportAllUser', 'users:editUser', 'users:assignRole', 'roles:editRole', 'roles:assignRight', 'rights:editRight'],
    frontEndPermission: ['users:query', 'users:exportRes', 'users:addUser', 'users:importUser', 'users:exportAllUser'],
    testPermission: [
      ['users:query', 'users:exportRes']
    ]
  },
  getters: {
    getRoles(state) {
      return state.roles
    },
    getPermissionList(state) {
      let data: any = sessionStorage.getItem('roles')
      if(JSON.parse(data)[0].id === 1) {
        return state.leaderPermission
      } else if(JSON.parse(data)[0].id === 2) {
        return state.managerPermission
      } else if(JSON.parse(data)[0].id === 3 || JSON.parse(data)[0].id === 4) {
        return state.frontEndPermission
      } else if(JSON.parse(data)[0].id === 6) {
        return state.testPermission
      }
    }
  },
  mutations: {
    setRoles(state, data) {
      state.roles = data
    }
  },
  actions: {
    commitSetRoles({commit}, payload) {
      commit('setRoles', payload)
    }
  },
  modules: {}
})
