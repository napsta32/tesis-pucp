FROM mariadb:10.7

COPY ./docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d
