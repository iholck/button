FROM eclipse-mosquitto
MAINTAINER Ivar Holck <ivar.holck@gmail.com>

LABEL Description="Modified Eclipse Mosquitto MQTT Broker - embedded modified config file"
COPY config/* /mosquitto/config/

RUN chown root root /mosquitto/config/* && \
    chmod 755 /mosquitto/config/*
VOLUME /mosquitto/data
