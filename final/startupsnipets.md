
docker build -t websocket-distribuida .
docker run -d -p 3000:3000 --name websocket-server  websocket-distribuida


docker build -t frontsocket-distribuida .
docker run -d -p 8000:80 --name websocket-server  frontsocket-distribuida