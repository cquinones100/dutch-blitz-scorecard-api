#/usr/bin/bash

PG_USER=$USER RAILS_ENV=production bundle exec rails db:migrate
bundle exec rails s -p 3001 -e production
