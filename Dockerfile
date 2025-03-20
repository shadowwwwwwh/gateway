# 第一阶段：构建阶段
FROM node:18-alpine AS build_image
# 安装必要的依赖，husky 依赖 git
RUN apk add --no-cache git
# 设置工作目录
WORKDIR /app
# 复制 package.json 和 package-lock.json（如果有）
COPY package*.json ./
# 安装项目依赖，跳过脚本执行
RUN npm install --ignore-scripts
# 初始化 husky
RUN npx husky install
# 复制项目文件
COPY . .
# 构建项目
RUN npm run build:pro

# 第二阶段：生产环境
FROM nginx:alpine AS prod_image
# 将构建好的文件复制到 Nginx 的默认站点目录
COPY --from=build_image /app/dist/ /etc/nginx/html/
# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf
# 暴露端口
EXPOSE 80
# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
