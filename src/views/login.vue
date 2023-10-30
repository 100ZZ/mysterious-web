<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">分布式压测平台</div>
			<el-form :model="param" :rules="rules" ref="userLogin" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="请输入用户名">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
          </el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="请不要用私人密码"
						v-model="param.password"
						@keyup.enter="userLogin"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="userLogin">登录</el-button>
				</div>
        <div class="login-btn">
          <el-button type="primary" @click="handleInsert">注册</el-button>
        </div>
				<p class="login-tips">无法解密，请牢记你的用户名密码。</p>
			</el-form>


<!--      注册-->
      <el-dialog title="新用户注册" v-model="insertVisible" width="30%">
        <el-form :model="insertForm" :rules="rules" ref="userRegister" label-width="0px" class="ms-content">
          <el-form-item prop="username">
            <el-input v-model="insertForm.username" placeholder="请输入用户名">
              <template #prepend>
                <el-button :icon="User"></el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                type="password"
                placeholder="请不要用私人密码，无法解密，密码请牢记"
                v-model="insertForm.password"
                @keyup.enter="userLogin"
            >
              <template #prepend>
                <el-button :icon="Lock"></el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="readName">
            <el-input v-model="insertForm.realName" placeholder="真实姓名">
              <template #prepend>
                <el-button :icon="User"></el-button>
              </template>
            </el-input>
          </el-form-item>

          <p class="login-tips">无法解密，请牢记你的用户名密码。</p>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="insertVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveInsert">确 定</el-button>
          </span>
        </template>
      </el-dialog>


    </div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import {addUser, login} from "../api/user";

interface LoginInfo {
	username: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	username: null,
	password: null
});

const rules: FormRules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const permiss = usePermissStore();

const userLogin = () => {
  login(param).then(res => {
    const code = res.data.code
    if (code != 0) {
      ElMessage.error(res.data.message);
      return false;
    }
    const token = res.data.data;
    localStorage.setItem('token', token);
    ElMessage.success('登录成功');
    localStorage.setItem('ms_username', param.username);
    const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'demo'];
    permiss.handleSet(keys);
    localStorage.setItem('ms_keys', JSON.stringify(keys));
    router.push('/');
  })
};

// 表格新增时弹窗和保存
const insertVisible = ref(false);
let insertForm = reactive({
  username: null,
  password: null,
  realName: null
});

const handleInsert = (row: any) => {
  insertVisible.value = true;
};

const saveInsert = async () => {
  insertVisible.value = false;
  const res = await addUser(insertForm);

  const code = res.data.code;
  if (code !== 0) {
    ElMessage.error(res.data.message);
  } else {
    ElMessage.success("注册成功");
  }
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-bg.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
