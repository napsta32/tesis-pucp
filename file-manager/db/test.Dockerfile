FROM mariadb:10.7

COPY ./docker-entrypoint-initdb.d/init.sql /docker-entrypoint-initdb.d
