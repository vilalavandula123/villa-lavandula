# Скриптове за проверка (по избор, за разработчик)

Изискват Python 3 и `pip install playwright aiosmtpd` (+ `playwright install chromium`), както и `npm i -D axe-core` за axe.py.

- `e2e.py noconfig|config|ui` — функционални сценарии (форма, галерия, меню, езици). Сайтът трябва да работи на http://localhost:3000.
- `smtpsink.py` — локален тестов SMTP сървър на порт 2525 (писмата се записват във файлове, нищо не се изпраща навън). За режим `config` стартирайте сайта с SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_USER=test SMTP_PASS=test MAIL_FROM=... ENQUIRY_TO=...
- `axe.py` — автоматична проверка за достъпност на всички страници.
