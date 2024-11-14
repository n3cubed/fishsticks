# Fishsticks Server

## To serve the app
```bash
node server.js
```

## Using Docker (linux/amd64/v8)
```bash
sudo docker pull n3cubed/fishsticks-server
sudo docker run \
  -p 49003:49003 \
  -v ~/Desktop/fishsticks_static:/app/out/fishsticks \
  n3cubed/fishsticks-server
```

Static files should be placed in the static folder on the host machine
