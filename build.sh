#!/bin/sh
TARGET="../pleroma" # Where pleroma’s repository is sitting

yarn install

rm -rf public/packs public/assets
env -i "PATH=$PATH" npm run build
for asset in sw.js packs sounds
do
	rm -rf "${TARGET}/priv/static/${asset}"
	cp -r "public/${asset}" "${TARGET}/priv/static/${asset}"
done
rsync -ra "public/emoji/" "${TARGET}/priv/static/emoji"
