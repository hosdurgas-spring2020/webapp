#!/bin/bash


cd /webapp

sudo npm install

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/webapp/test/api/statsConfig.json

# sudo npm install pm2 -g -f