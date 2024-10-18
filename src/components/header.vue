<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="collapseChage">
			<el-icon v-if="sidebar.collapse"><Expand /></el-icon>
			<el-icon v-else><Fold /></el-icon>
		</div>
		<div class="logo">分布式压测平台v2.0</div>


    <div class="header-right">
			<div class="header-user-con">
        <a class="custom-link" href="https://lihuia.com" target="_blank">
          <i class="el-icon-lx-message"></i>
        </a>
        <a class="custom-link" href="https://github.com/100ZZ/mysterious" target="_blank">
          <i class="el-icon-lx-likefill"></i>
        </a>
        <a class="custom-link">
          <i class="el-icon-lx-profile user-icon"></i> <!-- 将用户头像替换为图标 -->
        </a>
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="user">个人中心</el-dropdown-item>
							<el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';

const username: string | null = localStorage.getItem('ms_username');
const message: number = 2;

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}
});

// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		localStorage.removeItem('ms_username');
    localStorage.removeItem('token')
		router.push('/login');
	} else if (command == 'user') {
		router.push('/user');
	}
};
</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}
.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}
.header-right {
	float: right;
	padding-right: 50px;
}
.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.el-dropdown-menu__item {
	text-align: center;
}

.custom-link {
  color: #fff; /* 图标颜色 */
  text-decoration: none; /* 去掉下划线 */
  margin: 0 8px; /* 设置左右间距，减小为 8px */
  transition: color 0.3s; /* 添加过渡效果 */
}

.custom-link:hover {
  color: #f02d2d; /* 鼠标悬停时的颜色变化 */
}

.custom-link i {
  font-size: 24px; /* 设置图标大小 */
}

.user-icon {
  font-size: 30px; /* 调整用户图标大小 */
  margin-right: 5px; /* 为用户图标增加右边距 */
}

.user-name {
  display: inline-flex; /* 使用 inline-flex 使下拉菜单与头像在同一行 */
  align-items: center; /* 垂直对齐 */
}
</style>
