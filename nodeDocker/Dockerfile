FROM node:latest
COPY src /app
WORKDIR /app
EXPOSE 3000
RUN npm install
RUN apt-get -y update
RUN apt-get -y install netcat
CMD ['npm', 'start']