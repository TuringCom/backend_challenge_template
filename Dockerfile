FROM mysql:5.7
MAINTAINER Peter Adeoye <peter.a@turing.com>

# SETUP DATABASES
ENV MYSQL_DATABASE 'turing'
ENV MYSQL_ROOT_PASSWORD 'root'
ENV MYSQL_USER 'turing'
ENV MYSQL_PASSWORD 'turing'

COPY ./database/dump.sql /docker-entrypoint-initdb.d/dump.sql

ENV NODE_ENV=development
COPY package.json package-lock.json ./

RUN apt-get update && \
    apt-get install curl software-properties-common make -y && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash -

RUN apt-get update && \
    apt-get install -y \
    nodejs

RUN apt-get install build-essential -y

RUN mkdir /backend
WORKDIR /

COPY package-*.json .
RUN npm install

COPY . .

EXPOSE 80
COPY turing-entrypoint.sh /turing-entrypoint.sh

CMD ["sh", "turing-entrypoint.sh"]