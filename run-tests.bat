@echo off
cls
echo ===============================
echo 1/2 : Running Laravel Backend Tests
echo ===============================
cd %~dp0talibJobBackend
call php artisan test

echo.
echo ===============================
echo 2/2 : Running React Tests
echo ===============================
cd %~dp0talibJobFrontend
call npm test -- --watchAll=false

echo.
echo ===============================
echo TOUT EST TERMINE AVEC SUCCES !
echo ===============================
cd %~dp0
pause