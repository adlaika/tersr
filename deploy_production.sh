 #!/bin/bash

EC2KEY="/Users/michaelarnold/Documents/tersr-key.pem"

# echo CLEANING!
# gulp clean
# echo BUILDING!
# gulp build
echo COPYING
scp -i $EC2KEY -r server/* ec2-user@52.27.205.191:tersr
scp -i $EC2KEY package.json ec2-user@52.27.205.191:tersr
echo TUNNELING!
ssh -i $EC2KEY ec2-user@52.27.205.191 'cd; cd tersr; export NODE_ENV=production; node app.js; exit'
echo COMPLETED