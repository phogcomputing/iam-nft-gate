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

RUN yarn install 
RUN chown -R 1000:1000 /headless

RUN npm install -g miniflare

USER 1000

CMD ["yarn","run","dev"]
