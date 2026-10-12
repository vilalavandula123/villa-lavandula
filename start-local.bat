@echo off
chcp 65001 >NUL
cd /d "%~dp0"
where node >NUL 2>NUL || (echo Node.js не е инсталиран. Изтеглете LTS версия от https://nodejs.org && pause && exit /b 1)
echo Проверка и инсталиране на пакетите... && call npm install || (pause && exit /b 1)
echo Сглобяване на сайта...
call npm run build || (pause && exit /b 1)
start "" /b cmd /c "timeout /t 5 /nobreak >NUL & start http://localhost:3000"
echo Сайтът работи на http://localhost:3000 - затворете този прозорец, за да го спрете.
call npm start
