FROM oven/bun:latest as base
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install wget build-essential gcc git curl gnupg zip unzip -yq
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get update
RUN apt-get install nodejs -yq

WORKDIR /workspace
