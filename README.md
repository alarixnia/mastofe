# Mastodon Tootsuite / mastofe repository

Here is a fork of mastodon. We could really just remove all of the code except
for the frontend, but to easily pull the upstream repo we'll just keep
everything. This is my fork for the moment with the idea of making the mastofe
just as polished as the pleromafe. If you want to get access, open an issue or
hit me up at howl@social.zxq.co.

# Development

I use a combination of the pleroma backend + yarn + nginx to do local
development. I refuse to install Ruby. Here's how to get it running on your own
machine:

## Install yarn

Yarn will be needed to set up the mastodon frontend for development. Check out
https://yarnpkg.com/lang/en/docs/install/ . For Debian, it's like this:

```sh
# import yarn pub key and repo
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn
```

## Mastodon Frontend Setup

```sh
# Install dependencies
yarn install -D
npm run dev
# check that http://localhost:3035/packs/common.css works in your browser once
# webpack is done compiling. if css shows up, then it should have worked!
```

## nginx setup

I'll assume that you have already fired up pleroma using the installation guide.
To work on the frontend while still having the backend up, use this nginx
config.

```
server {
    listen 80;
    server_name pleroma.testing;

    location /packs {
        add_header 'Access-Control-Allow-Origin' '*';
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;

        proxy_pass http://localhost:3035;
    }

    location / {
        add_header 'Access-Control-Allow-Origin' '*';
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;

        proxy_pass http://localhost:4000;
    }
}
```

Change the `server_name` if you like. I personally like to create a new entry
in /etc/hosts and add `127.0.0.1 pleroma.testing`, but you do what suits you.

If you have enough luck, navigating to your \<server\_name\>/web should show
you the mastodon frontend, and should also work with all the nice things of
webpack such as hot reloading. Have fun!
