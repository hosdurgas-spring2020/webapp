 
#!/bin/bash

# Stop all servers and start the server as a daemon
cd /webapp
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/webapp/test/api/statsConfig.json -s   
pm2 stop all
sudo chown -R ubuntu .
killall -9 node
pm2 start server.js 