 #!/bin/bash

# TODO: maybe add key to circleCI?
# EC2KEY="secrets/tersr-key.pem"

# echo CLEANING!
# gulp clean
# echo BUILDING!
# gulp build
echo COPYING
# maybe use ssh -> git clone instead? Would guarantee use of the production branch
scp -i $EC2KEY -r server/* ec2-user@52.27.205.191:tersr
scp -i $EC2KEY package.json ec2-user@52.27.205.191:tersr
echo TUNNELING!
# TODO: figure out how to send ctrl-a d keystroke to remote machine so that this machine doesn't get stuck in node's output
ssh -t -i $EC2KEY ec2-user@52.27.205.191 'cd; cd tersr; killall node; export NODE_ENV=production; screen nodemon app.js'
echo COMPLETED