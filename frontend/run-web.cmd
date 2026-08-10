@echo off
set "PATH=C:\Program Files\nodejs;C:\Windows\System32;C:\Windows"
cd /d "%~dp0"
npm.cmd run web -- --port 8082 > .expo-web.log 2>&1
