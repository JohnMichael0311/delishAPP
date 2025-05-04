@echo off
echo Starting Redis Server...
if not exist "redis" mkdir redis
cd redis

if not exist "redis-server.exe" (
    echo Downloading Redis...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip' -OutFile 'redis.zip'"
    echo Extracting Redis...
    powershell -Command "Expand-Archive -Path 'redis.zip' -DestinationPath '.'"
    del redis.zip
)

echo Starting Redis Server...
start /B redis-server.exe
echo Redis Server is running...
timeout /t 2 /nobreak > nul
