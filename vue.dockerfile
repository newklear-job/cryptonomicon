FROM node:16

ARG GID
ARG UID
ARG GITHUB_TOKEN

USER $UID:$GID

# github personal access token
RUN git config --global user.email "petergerinv@gmail.com"
RUN git config --global user.name "Vitalii"
RUN git config --global url.https://$GITHUB_TOKEN:@github.com/.insteadOf https://github.com/
