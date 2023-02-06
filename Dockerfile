FROM node:16.17-bullseye

LABEL io.k8s.description="phog-gateway" \
      io.k8s.display-name="phog-gateway"

ENV PORT=8787
EXPOSE $PORT

### Envrionment config
ENV HOME=/headless \
    TERM=xterm 

WORKDIR $HOME/

COPY . .

RUN apt-get update && apt-get install --yes vim docker-compose python3-pip
RUN yarn install 
RUN chown -R 1000:1000 /headless
RUN npm install -g miniflare
RUN npm install -g get-port

USER 1000

RUN pip install flask

CMD ["yarn","run","dev"]
