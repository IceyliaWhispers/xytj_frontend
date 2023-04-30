import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const actions = {
    async changePassword(context, value){
        if(context.state.adminInfo === null){
            this.updateAdminInfo(window.sessionStorage.getItem("id"));

        }
        let newValue = this._vm.$deepCopy(context.adminInfo);
        newValue.password = value;
        console.log(newValue);
        const { data: res } = await this._vm.$http.put("/admin/update", newValue);
        if (res.code === 0){
            this._vm.$message.error("修改失败");
            return false;
        };
        this._vm.$message.success("密码修改成功");
        context.commit("EDITADMININFO", newValue);
        return true;
    },
    async updateAdminInfo({commit}, id){
        const {data:res} = await this._vm.$http.get(`/admin/${id}`);
        if(res.code === 0) return this._vm.$message.error("获取信息失败");
        commit(EDITADMININFO, res.data);
    }
};
const mutations = {
    // 提交管理员账户信息
    EDITADMININFO(state, value) {
        state.adminInfo = value;
    },
    
};
const state = {
    adminInfo: null,
};
export default new Vuex.Store({
    actions,
    mutations,
    state,
});