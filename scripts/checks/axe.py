import asyncio, json
from playwright.async_api import async_playwright
paths=['/bg','/bg/kashtata','/bg/galeriya','/bg/rayonat','/bg/zapitvane','/bg/kontakti','/bg/poveritelnost','/en','/en/the-house','/en/gallery','/en/the-area','/en/enquiry','/en/contact','/en/privacy']
axe=open('node_modules/axe-core/axe.min.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        total=0
        for w in (1280,390):
            pg=await (await b.new_context(viewport={'width':w,'height':900})).new_page()
            for path in paths:
                await pg.goto('http://localhost:3000'+path); await pg.wait_for_load_state('networkidle')
                await pg.add_script_tag(content=axe)
                r=await pg.evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}})")
                v=r['violations']; total+=len(v)
                if v:
                    for x in v: print(w,path,x['id'],x['impact'],len(x['nodes']), x['nodes'][0]['target'], x['nodes'][0].get('failureSummary','')[:200])
        # dialog state
        pg=await (await b.new_context(viewport={'width':1280,'height':900})).new_page()
        await pg.goto('http://localhost:3000/bg/galeriya'); await pg.wait_for_load_state('networkidle')
        await pg.locator('ul button').first.click(); await pg.wait_for_timeout(500)
        await pg.add_script_tag(content=axe)
        r=await pg.evaluate("axe.run(document.querySelector('dialog'))")
        for x in r['violations']: print('dialog',x['id'],x['nodes'][0]['target'])
        total+=len(r['violations'])
        print('TOTAL violations', total)
        await b.close()
asyncio.run(main())
