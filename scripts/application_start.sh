 
#!/bin/bash

# Stop all servers and start the server as a daemon
cd /webapp
pm2 stop all
sudo chown -R ubuntu .
killall -9 node
pm2 start server.js 