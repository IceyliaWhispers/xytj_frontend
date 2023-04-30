<template>
  <el-container>
    <el-header>
      <div id="header_logo" @click="goHome">
        <img src="../assets/logo.png" alt="" />
        <span class="ccxkt">西柚碳迹</span>
      </div>

      <div>
        <div class="time_container">{{ dateYear }} {{ dateDay }}</div>

        <el-popover
          class="avater_container"
          placement="bottom"
          trigger="hover"
          v-model="userInfoVisible"
        >
          <p @click="changeVisible = true">修改密码</p>
          <el-divider></el-divider>
          <p @click="logout">退出登录</p>
          <div slot="reference" class="userInfo">
            <img src="@/assets/imgs/avatar.png" alt="" />
          </div>
        </el-popover>
        <!-- <el-button type="info" @click="editPassword">修改密码</el-button>
        <el-button type="info" @click="logout">退出</el-button> -->
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边菜单 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">账户管理</span>
            </template>
            <el-menu-item index="1-1" route="admin">
              <i class="el-icon-s-tools"></i>
              <span>管理员</span>
            </el-menu-item>
            <el-menu-item index="1-2" route="user">
              <i class="el-icon-s-unfold"> </i>
              <span>用户</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="2" route="order">
            <i class="el-icon-suitcase"></i>
            <span slot="title">骑行记录</span>
          </el-menu-item>
          <el-menu-item index="3" route="categories">
            <i class="el-icon-goods"></i>
            <span slot="title">商品管理</span>
          </el-menu-item>
          <el-menu-item index="4" route="chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">碳足迹分析</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changeVisible"
      width="30%"
      @close="changeDialogClosed"
    >
      <el-form
        :model="changeForm"
        :rules="changeFormRules"
        ref="changeFormRef"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="changeForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword1">
          <el-input v-model="changeForm.newPassword1"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input v-model="changeForm.newPassword2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewPassword">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { updateAdmin, getAdmin } from "@/api";
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
      userInfoVisible: false,
      changeVisible: false,
      timer: null, //实时时间
      dateDay: null,
      dateYear: null,
      changeForm: {
        oldPassword: "123456",
        newPassword1: "123456",
        newPassword2: "123456",
      },
      changeFormRules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        newPassword1: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        newPassword2: [
          { required: true, message: "请再一次输入新密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 切换按钮的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 修改密码
    async submitNewPassword() {
      this.$refs.changeFormRef.validate(async (valid) => {
        // 验证输入
        if (!valid) return;

        if (this.changeForm.newPassword1 !== this.changeForm.newPassword2) {
          this.$message.error("新旧密码不一致");
          return;
        }
        // 获取当前的用户信息
        const res = await getAdmin(window.sessionStorage.getItem("id"));

        if (res.code === 0) return this.$message.error("获取账户信息失败");
        if (md5(this.changeForm.oldPassword) !== res.data.password) {
          return this.$message.error("密码错误，请检查输入");
        }
        res.data.password = this.changeForm.newPassword1;
        // 修改密码
        const updateRes = await updateAdmin(res.data);
        if (updateRes.code === 0) return this.$message.error("修改失败");
        this.$message.success("修改成功");
        this.changeVisible = false;
      });
    },
    changeDialogClosed() {
      this.$refs.changeFormRef.resetFields();
    },
    goHome(){
      this.$router.push("home");
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      const date = this.$dayjs(new Date());
      this.dateDay = date.format("HH:mm:ss");
      this.dateYear = date.format("YYYY-MM-DD");
    }, 1000);
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {},
};
</script>

<style scoped>
.ccxkt{
  font-size: 25px;
}
.avater_container{
  margin-right: 20px;
}
#header_logo {
  width: auto;
  margin-left: 20px;
  cursor: pointer;

}
#header_logo img {
  object-fit: contain;
  width: 80px;
}
.time_container{
  margin-right: 20px;
  font-size: 18px;
}
.userInfo {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
}
.userInfo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
p {
  text-align: center;
  cursor: pointer;
}
p:hover {
  color: var(--primary3);
}
img {
  width: 120px;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: var(--primary1);
  display: flex;
  justify-content: space-between;
  color: white;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  font-family: "思源黑体 Normal";
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  margin-left: 15px;
}
.toggle-button {
  background-color: var(--primary1);
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  border: var(--primary3) solid 0.1px;
}

.el-aside {
  background-color: var(--primary1);
}
.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>