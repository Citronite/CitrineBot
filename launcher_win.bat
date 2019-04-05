@echo off

REM At the moment, this file will simply start the launcher.
REM But eventually, it will also check if the correct version
REM of nodejs is installed.

cls
title Citrine Launcher
echo Starting launcher...
node ./launcher/main.js
pause
