#!/bin/sh
set -e

# Run migrations (for SQLite this will create/update the DB file)
./node_modules/.bin/prisma migrate deploy

# Start the Nest app
# (If your build outputs dist/src/main.js instead, change this line accordingly)
exec node dist/src/main.js
