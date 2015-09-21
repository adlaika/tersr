 #!/bin/bash

EC2KEY = "/Users/michaelarnold/Documents/tersr-key.pem"

# echo CLEANING!
# gulp clean
# echo BUILDING!
# gulp build
echo COPYING
scp -r -i EC2KEY server ec2-user@52.27.205.191:tersr
scp -i EC2KEY package.json ec2-user@52.27.205.191:tersr
echo TUNNELING!
ssh -i EC2KEY ec2-user@52.27.205.191 <<'ENDSSH'
export NODE_ENV=production
ENDSSH
echo COMPLETED