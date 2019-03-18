FROM node:8.15.0-jessie

WORKDIR /usr/srs/facerecognition

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]