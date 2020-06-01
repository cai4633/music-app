import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import actions from "./actions";
import mutations from "./mutations";
import * as getters from "./getter";
import createLogger from "vuex/dist/logger";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {},
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
