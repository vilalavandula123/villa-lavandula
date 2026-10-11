import asyncio, time
from aiosmtpd.controller import Controller
class H:
    async def handle_DATA(self, server, session, envelope):
        fn=f"./.test-mail/{time.time():.3f}.eml"
        open(fn,'wb').write(envelope.original_content or envelope.content)
        return '250 OK'
from aiosmtpd.smtp import AuthResult
def auth(server, session, envelope, mechanism, auth_data):
    return AuthResult(success=True)
c=Controller(H(), hostname='127.0.0.1', port=2525, authenticator=auth, auth_require_tls=False)
c.start(); print('sink up'); 
import signal; signal.pause()
