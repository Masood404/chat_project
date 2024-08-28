FROM node 
COPY . /chat_project/frontend
WORKDIR /chat_project/frontend
RUN npm install
RUN npm run build
RUN npm install -g serve
EXPOSE 3000 
CMD ["serve", "-s", "build", "-l", "3000"]