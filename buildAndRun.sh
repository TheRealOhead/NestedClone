#!/bin/bash
set -e

npm run build
http-server ./docs -p 8000