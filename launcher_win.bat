@echo off
rem At the moment, this file will simply start the launcher.
rem But eventually, it will also check if node is on path

cls
title Citrine Launcher
node  "%~dp0\launcher\main.js" %*
pause
