#!/bin/sh
TARGET="../pleroma" # Where pleroma’s repository is sitting

yarn install -D

rm -rf public/packs public/assets
env -i "PATH=$PATH" npm run build
cp public/assets/sw.js "${TARGET}/priv/static/sw.js"
rm -rf "${TARGET}/priv/static/packs"
cp -r public/packs "${TARGET}/priv/static/packs"
