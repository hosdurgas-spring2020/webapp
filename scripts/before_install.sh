#!/bin/bash

# Install node.js


# Install nodemon
# sudo npm install nodemon -g

# Install forever module 
# https://www.npmjs.com/package/forever
ls
sudo rm -rf /webapp
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop

# Clean working folder
# sudo find /home/ubuntu/test -type f -delete