<template>
  <div id="login_container">
    <div class="leaves">
      <div class="set">
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
        <div><img src="../assets/imgs/login_leaf.png" /></div>
      </div>
    </div>
    <img src="../assets/imgs/login_bgcolor.jpg" class="bg" />

    <div class="login_box">
      <!--表单提交区域-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        :rules="loginFormRules"
        class="login_form"
      >
        <h2 id="title" class="ccxkt">西柚碳迹</h2>
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="username"
            class="input"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="password"
            class="input"
          ></el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <button id="login" @click="login">登录</button>
          <button id="reset" @click="resetLoginForm">重置</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login as login_api } from "@/api";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await login_api(this.loginForm);
        if (res.code === 0) {
          this.$message.error("账号或密码错误");
          return false;
        }
        this.$message.success("登录成功");
        window.sessionStorage.setItem("id", res.data.id);
        this.$router.push("home");
      });
    },
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#title {
  font-family: "思源黑体 Normal";
  color: var(--primary1);
  /* color: green; */
  font-size: 45px;
  position: relative;
  display: flex;
  justify-content: center;
}
.login_box {
  outline: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: none;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.login_form {
  position: relative;
  padding: 60px 60px 60px 60px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  width: 480px;
  border-radius: 20px;
  border: 1px solid #fff;
  border-right-color: rgba(255, 255, 255, 0.5);
  border-bottom-color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 400px;
  justify-content: space-between;
}

button {
  color: white;
  background-color: var(--primary1);
  border-radius: 5px;
  cursor: pointer;

  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition: background-color 0.3s ease-out;
  box-shadow: inset rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
#login:hover,
#reset:hover {
  background: var(--primary2);
  color: #fff;
  text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  box-shadow: inset rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
button:active {
  box-shadow: none;
  transform: translateY(2px);
}
#reset {
  margin-left: 50px;
}
.el-input--prefix {
  border: none;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  transition: box-shadow 0.3s ease-out;
}
.btns {
  display: flex;
  justify-content: space-evenly;
}
img {
  width: 20px;
}
.leaves {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  pointer-events: none;
}
.btns {
  margin-left: 0px;
}
.leaves .set {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  pointer-events: none;
}

.leaves .set div {
  position: absolute;
  display: block;
}

.leaves .set div:nth-child(1) {
  left: 20%;
  animation: animate 20s linear infinite;
  animation-delay: -10s;
}
.leaves .set div:nth-child(2) {
  left: 50%;
  animation: animate 14s linear infinite;
  animation-delay: -7s;
}
.leaves .set div:nth-child(3) {
  left: 70%;
  animation: animate 12s linear infinite;
  animation-delay: -7s;
}
.leaves .set div:nth-child(4) {
  left: 5%;
  animation: animate 15s linear infinite;
  animation-delay: -7s;
}
.leaves .set div:nth-child(5) {
  left: 85%;
  animation: animate 18s linear infinite;
  animation-delay: -7s;
}
.leaves .set div:nth-child(6) {
  left: 90%;
  animation: animate 12s linear infinite;
  animation-delay: -5s;
}
.leaves .set div:nth-child(7) {
  left: 15%;
  animation: animate 14s linear infinite;
  animation-delay: -21s;
}
.leaves .set div:nth-child(8) {
  left: 3%;
  animation: animate 18s linear infinite;
}
.leaves .set div:nth-child(9) {
  left: 12%;
  animation: animate 13s linear infinite;
  animation-delay: -70s;
}
.leaves .set div:nth-child(10) {
  left: 34%;
  animation: animate 16s linear infinite;
}
.leaves .set div:nth-child(11) {
  left: 96%;
  animation: animate 17s linear infinite;
}

@keyframes animate {
  0% {
    opacity: 0;
    top: -10%;
    transform: translateX(20px) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  20% {
    transform: translateX(-20px) rotate(45deg);
  }
  40% {
    transform: translateX(-20px) rotate(90deg);
  }
  60% {
    transform: translateX(20px) rotate(180deg);
  }
  80% {
    transform: translateX(-20px) rotate(45deg);
  }
  100% {
    top: 110%;
    transform: translateX(20px) rotate(225deg);
  }
}
</style>