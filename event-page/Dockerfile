FROM mhart/alpine-node:8.6.0
WORKDIR /app
COPY /server . 
WORKDIR /app/server
RUN yarn install --production
EXPOSE 8080
CMD ["npm", "start"]
