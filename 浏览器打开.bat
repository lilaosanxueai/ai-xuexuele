@echo off
rem AI XueXueLe (creative-island) - ensure service on 8787 then open in browser
set PORT=8787
netstat -ano -p tcp | findstr ":%PORT%" | findstr LISTENING >nul 2>&1
if %errorlevel%==0 goto open
cd /d "%~dp0"
start "svc-ci" /min cmd /c call start.bat
set /a tries=0
:wait
timeout /t 2 /nobreak >nul
set /a tries+=1
netstat -ano -p tcp | findstr ":%PORT%" | findstr LISTENING >nul 2>&1
if %errorlevel%==0 goto open
if %tries% lss 90 goto wait
echo service not ready after ~180s - check the minimized service window
pause
exit /b 1
:open
start "" "http://127.0.0.1:8787/"
