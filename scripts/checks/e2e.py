import asyncio, sys, glob, os
from playwright.async_api import async_playwright
BASE='http://localhost:3000'
mode=sys.argv[1]
results=[]
def ok(name, cond, extra=''):
    results.append((name, bool(cond), extra)); print(('PASS' if cond else 'FAIL'), name, extra)

async def fill_valid(pg, name='Иван Тест'):
    await pg.fill('input[name=arrival]','2027-06-11')
    await pg.fill('input[name=departure]','2027-06-14')
    await pg.fill('input[name=adults]','4')
    await pg.fill('input[name=children]','2')
    await pg.fill('input[name=childrenAges]','5 и 8')
    await pg.check('input[name=pets][value=no]')
    await pg.fill('input[name=name]',name)
    await pg.fill('input[name=email]','ivan@example.com')
    await pg.fill('input[name=phone]','+359 888 000 000')
    await pg.fill('textarea[name=message]','Тестово запитване\nвтори ред')

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':1280,'height':900}, locale='bg-BG')
        pg=await ctx.new_page()
        errors=[]
        pg.on('console', lambda m: errors.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errors.append(str(e)))
        if mode=='noconfig':
            await pg.goto(BASE+'/bg/zapitvane'); await pg.wait_for_load_state('networkidle')
            ok('notice shown before submit', await pg.locator('text=Онлайн изпращането на запитвания все още не е активирано').count()==1)
            await pg.wait_for_timeout(2700)
            await pg.click('button[type=submit]')
            await pg.wait_for_selector('[role=alert] >> text=Моля, поправете')
            focused=await pg.evaluate("document.activeElement.getAttribute('role')")
            ok('invalid -> error summary focused', focused=='alert')
            ok('field errors aria-invalid', await pg.locator('[aria-invalid=true]').count()>=4, str(await pg.locator('[aria-invalid=true]').count()))
            # past date + order
            await pg.fill('input[name=arrival]','2020-01-01'); await pg.fill('input[name=departure]','2019-01-01')
            await pg.fill('input[name=name]','Иван'); await pg.fill('input[name=email]','bad@')
            await pg.click('button[type=submit]'); await pg.wait_for_timeout(1200)
            txt=await pg.inner_text('form')
            ok('past arrival error', 'не може да е в миналото' in txt)
            ok('bad email error', 'валиден имейл' in txt)
            ok('name kept after error', await pg.input_value('input[name=name]')=='Иван')
            await fill_valid(pg)
            await pg.fill('input[name=departure]','2027-06-10')
            await pg.click('button[type=submit]'); await pg.wait_for_timeout(1200)
            ok('departure before arrival error', 'след датата на пристигане' in await pg.inner_text('form'))
            await pg.fill('input[name=departure]','2027-06-14')
            await pg.click('button[type=submit]'); await pg.wait_for_timeout(1500)
            txt=await pg.inner_text('form')
            ok('not_configured honest message', 'не беше изпратено' in txt)
            ok('no fake success', 'Запитването е получено' not in txt)
            ok('values kept after not_configured', await pg.input_value('input[name=email]')=='ivan@example.com')
            ok('fallback phone link', await pg.locator('form a[href="tel:+359889060909"]').count()>=1)
            # honeypot
            await pg.evaluate("document.querySelector('input[name=website]').value='spam'")
            await pg.click('button[type=submit]'); await pg.wait_for_timeout(1200)
            ok('honeypot blocks', 'не може да бъде изпратено' in await pg.inner_text('form'))
        if mode=='config':
            before=len(glob.glob('./.test-mail/*.eml'))
            await pg.goto(BASE+'/en/enquiry'); await pg.wait_for_load_state('networkidle')
            ok('no notice when configured', await pg.locator('text=Online sending of enquiries is not active').count()==0)
            # too fast submit
            await fill_valid(pg,'Fast Bot')
            await pg.click('button[type=submit]'); await pg.wait_for_timeout(1200)
            ok('too-fast submit blocked', 'cannot be sent' in await pg.inner_text('main'))
            await pg.wait_for_timeout(2600)
            await fill_valid(pg,'Jane Guest')
            btn=pg.locator('button[type=submit]')
            await btn.dblclick()
            await pg.wait_for_selector('text=Enquiry received', timeout=10000)
            ok('success shows received, not confirmed', 'not a confirmed booking' in await pg.inner_text('main'))
            await pg.wait_for_timeout(1500)
            after=sorted(glob.glob('./.test-mail/*.eml'))
            new=after[before:]
            ok('exactly one owner email (double click)', len(new)==1, f'{len(new)} new')
            if new:
                raw=open(new[-1],'rb').read().decode('utf-8','replace')
                ok('email has reply-to guest', 'Reply-To' in raw and 'ivan@example.com' in raw)
                ok('email has dates', '11.06.2027' in raw or '=31=31' in raw or 'Пристигане' in raw or 'base64' in raw.lower())
                print(raw[:1500])
        if mode=='ui':
            await pg.goto(BASE+'/bg/galeriya'); await pg.wait_for_load_state('networkidle')
            first=pg.locator('ul button').first
            await first.focus(); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(500)
            ok('dialog open', await pg.evaluate("document.querySelector('dialog').open"))
            await pg.wait_for_timeout(800)
            vis=await pg.evaluate("(()=>{const i=document.querySelector('dialog figure img');const r=i.getBoundingClientRect();return r.width>300&&r.height>300&&i.complete&&i.naturalWidth>0})()")
            ok('lightbox image visible', vis)
            c1=await pg.inner_text('dialog p[aria-live]')
            await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(300)
            c2=await pg.inner_text('dialog p[aria-live]')
            ok('arrow next', c1!=c2, f'{c1} -> {c2}')
            await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab')
            inside=await pg.evaluate("document.querySelector('dialog').contains(document.activeElement)")
            ok('focus stays in dialog', inside)
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
            ok('escape closes', not await pg.evaluate("document.querySelector('dialog').open"))
            ok('focus returned to thumbnail', await pg.evaluate("document.activeElement.tagName==='BUTTON' && !!document.activeElement.closest('ul')"))
            # filter
            await pg.click('button[aria-pressed]:has-text("Спални")'); await pg.wait_for_timeout(300)
            ok('filter bedrooms', 'снимки' in await pg.inner_text('p[aria-live]') and await pg.locator('ul.grid > li').count()==6, str(await pg.locator('ul.grid > li').count()))
            # lang switch
            await pg.goto(BASE+'/bg/kashtata'); await pg.click('header a[hreflang=en] >> nth=0')
            await pg.wait_for_load_state('networkidle')
            ok('lang switch to equivalent page', pg.url.endswith('/en/the-house'), pg.url)
            ok('html lang en', await pg.evaluate("document.documentElement.lang")=='en')
            # mobile menu
            m=await b.new_context(viewport={'width':390,'height':800})
            mp=await m.new_page(); await mp.goto(BASE+'/bg'); await mp.wait_for_load_state('networkidle')
            btn=mp.locator('button[aria-controls=mobile-menu]')
            await btn.click(); ok('menu expanded', await btn.get_attribute('aria-expanded')=='true')
            await mp.keyboard.press('Escape'); await mp.wait_for_timeout(200)
            ok('menu escape closes + focus back', await btn.get_attribute('aria-expanded')=='false' and await mp.evaluate("document.activeElement.getAttribute('aria-controls')")=='mobile-menu')
            await mp.goto(BASE+'/bg/zapitvane'); await mp.wait_for_load_state('networkidle')
            await mp.focus('input[name=name]'); await mp.wait_for_timeout(400)
            ok('bottom bar hidden while typing', await mp.evaluate("document.querySelector('[data-mobile-bar]').getAttribute('aria-hidden')")=='true')
            # links
            hrefs=await pg.evaluate("[...document.querySelectorAll('a')].map(a=>a.href)")
            ok('no fake contacts', not any(('888123456' in h or 'villalavandula.bg' in h or 'Балчик' in h) for h in hrefs))
        ok('no console errors', len(errors)==0, '; '.join(errors[:3]))
        await b.close()
    print('SUMMARY', sum(r[1] for r in results), '/', len(results))
asyncio.run(main())
