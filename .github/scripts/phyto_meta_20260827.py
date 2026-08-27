from pathlib import Path

pages = {
    'client/phyto/index.html': (
        'https://9works.kr/client/phyto/',
        'NINEWORKS | PhytoRevolution · 고스란 프로젝트',
        '파이토레볼루션 · 고스란 브랜드 프로젝트 전용 클라이언트 페이지입니다.'
    ),
    'client/phyto/contract.html': (
        'https://9works.kr/client/phyto/contract.html',
        'NINEWORKS | 파이토레볼루션 계약서',
        '파이토레볼루션 · 고스란 브랜드 프로젝트 계약서 확인 페이지입니다.'
    ),
    'client/phyto/quote.html': (
        'https://9works.kr/client/phyto/quote.html',
        'NINEWORKS | 파이토레볼루션 견적서',
        '파이토레볼루션 · 고스란 브랜드 프로젝트 견적서 확인 페이지입니다.'
    ),
    'client/phyto/business-registration.html': (
        'https://9works.kr/client/phyto/business-registration.html',
        'NINEWORKS | 사업자등록 정보',
        '파이토레볼루션 프로젝트용 나인웍스 사업자등록 정보 페이지입니다.'
    ),
    'client/phyto/bank-account.html': (
        'https://9works.kr/client/phyto/bank-account.html',
        'NINEWORKS | 정산 계좌 정보',
        '파이토레볼루션 프로젝트용 나인웍스 정산 계좌 확인 페이지입니다.'
    ),
}

marker = '<!-- NINEWORKS PHYTO META -->'
image = 'https://9works.kr/assets/kakao-preview.png?v=20260825-2'
robots = '<meta name="robots" content="noindex,nofollow">'

for filename, (url, title, desc) in pages.items():
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    if marker in text:
        continue

    block = f'''\n{marker}
<link rel="icon" type="image/png" href="/favicon.png?v=20260825-1">
<link rel="alternate icon" type="image/svg+xml" href="/favicon.svg?v=20260825-1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NINEWORKS">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{image}">
<meta property="og:image:secure_url" content="{image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{image}">
'''

    if robots in text:
        text = text.replace(robots, robots + block, 1)
    else:
        text = text.replace('</title>', '</title>' + block, 1)
    path.write_text(text, encoding='utf-8')
