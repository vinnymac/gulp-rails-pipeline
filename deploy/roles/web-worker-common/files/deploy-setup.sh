#!/usr/bin/env sh

ENVIRONMENT="staging";
ROLE="web"
DATE=`/bin/date +%Y%m%d%H%M%S`;
DEPLOYPATH="/var/www/releases/$DATE";
BRANCH="develop"
BUCKET="static-oahu-lua-me"

echo "Set hostname"
HOSTNAME=lua-$ROLE-$ENVIRONMENT
hostname $HOSTNAME
echo "127.0.0.1 $HOSTNAME" >> /etc/hosts

rm /etc/environment;
ln -sf /var/www/current/config/environments/$ENVIRONMENT/env /etc/environment

echo 'run this stuff as ubuntu'
su - ubuntu -c "
ssh-add ~/.ssh/id_rsa;
echo 'Clone webapp to $DEPLOYPATH';
cd /var/www/repo && git remote update;
mkdir -p $DEPLOYPATH;
git archive $BRANCH | tar -x -f - -C $DEPLOYPATH
CURRENT_REVISION=$(git rev-list --max-count=1 --abbrev-commit $BRANCH) ;
echo $CURRENT_REVISION > $DEPLOYPATH/REVISION;
chmod -R -- g+w $DEPLOYPATH;

mkdir -p /var/www/shared/log;
ln -sf /var/www/shared/log $DEPLOYPATH;
mkdir -p /var/www/shared/pids;
ln -s /var/www/shared/vendor/bundle $DEPLOYPATH/vendor/bundle

cd $DEPLOYPATH
echo 'Installing gems';
bundle install --path ./vendor/bundle --deployment --quiet --local --jobs 4 --without development test ;

echo 'Precompiling assets and uploading to s3';
bundle exec rake assets:precompile;
aws s3 sync $DEPLOYPATH/public/assets/ s3://$BUCKET/assets/;
rm -rf $DEPLOYPATH/public/assets/*

echo 'Downloading assets from s3';
mkdir -p $DEPLOYPATH/public/assets;
aws s3 sync s3://$BUCKET/assets/ $DEPLOYPATH/public/assets/;
echo 'Finished syncing assets';

echo 'link $DEPLOYPATH to /var/www/current';
rm /var/www/current; ln -sf $DEPLOYPATH /var/www/current;
"

echo 'Reloading /etc/environment';
source /etc/environment;
echo "Restarting $ROLE on WEB_HOST: $WEB_HOST"
start $ROLE;

echo "$ROLE successfully restarted";

#traceview log
tlog -m "booted instance"

rm /etc/rsyslog.d/51-webapp_rsyslog.conf;
ln -s /var/www/current/config/rsyslog.conf /etc/rsyslog.d/51-webapp_rsyslog.conf;
restart rsyslog
