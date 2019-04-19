@echo off

rem At the moment, this file will simply start the launcher.
rem But eventually, it will also check if the correct version
rem of nodejs is installed.

cls
title Citrine Launcher
echo Starting launcher...
node ./launcher/main.js
pause
