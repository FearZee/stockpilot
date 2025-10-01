#!/bin/sh
set -e

# Ensure the database folder exists and is writable by nextjs
mkdir -p /app/data
chown -R nextjs:nodejs /app/data

# Switch to nextjs user and execute the command
exec su-exec nextjs "$@"