(() => {
  const workId = new URLSearchParams(window.location.search).get('work') || '';
  if (!['kekomi','the-petrichor'].includes(workId)) return;

  const rewriteHeading = (heading, label, title, copy) => {
    if (!heading) return;
    const labelEl = heading.querySelector('span');
    const titleEl = heading.querySelector('h3');
    const copyEl = heading.querySelector('p');
    if (labelEl) labelEl.textContent = label;
    if (titleEl) titleEl.textContent = title;
    if (copyEl) copyEl.textContent = copy;
  };

  const configs = {
    kekomi: {
      title:'카페24의 운영성과 브랜드 경험을 하나의 커머스 구조로.',
      headings:[
        ['A / COMMERCE PLANNING','유지할 쇼핑 기능과 새로 만들 브랜드 경험을 먼저 구분했습니다.','카페24의 회원·상품·주문 기능은 유지하고 메인·제품·이벤트·매거진처럼 브랜드 표현이 필요한 영역을 새롭게 설계했습니다.'],
        ['B / STOREFRONT ARCHITECTURE','상품을 파는 화면과 브랜드를 경험하는 화면을 연결했습니다.','브랜드 비주얼, 제품 탐색, 상세페이지와 구매 기능이 하나의 흐름으로 이어지도록 쇼핑몰 구조를 재정리했습니다.'],
        ['C / CUSTOM CODE LAYER','카페24 위에 필요한 화면만 커스텀 코드로 확장했습니다.','HTML·CSS·JavaScript로 메인, 모션 띠배너, 내비게이션과 콘텐츠 페이지를 구현해 기존 스킨의 인상을 브랜드에 맞게 바꿨습니다.'],
        ['D / INFORMATION ARCHITECTURE','브랜드·제품·캠페인·매거진의 역할을 분리했습니다.','각 페이지가 서로 경쟁하지 않고 사용자가 제품을 이해하고 구매로 이동하는 순서에 맞게 콘텐츠 위계를 구성했습니다.'],
        ['E / COMMERCE FLOW','브랜드 인상에서 실제 주문까지 전환 흐름을 설계했습니다.','제품 발견, 상세 정보, 이벤트 혜택과 장바구니·주문 기능이 자연스럽게 이어지도록 구매 동선을 정리했습니다.'],
        ['F / PRODUCT & CONTENT STRUCTURE','상세페이지와 이벤트·매거진을 독립 콘텐츠 구조로 만들었습니다.','상품 세팅과 판매 기능은 카페24에서 운영하면서 캠페인과 브랜드 콘텐츠는 목적에 맞는 커스텀 페이지로 구현했습니다.'],
        ['G / OPERATION & DELIVERY','리뉴얼 이후 실제 판매와 운영까지 이어지도록 세팅했습니다.','상품 상세 제작, 카페24 상품 등록과 판매 환경, 이벤트와 매거진 페이지를 함께 정리해 운영 가능한 상태로 완성했습니다.']
      ]
    },
    'the-petrichor': {
      title:'브랜드 비주얼부터 회원 경험과 구매까지, 하나의 스킨케어 커머스로.',
      headings:[
        ['A / BRAND COMMERCE PLANNING','브랜드 감성과 제품 구매 흐름을 처음부터 함께 설계했습니다.','브랜드 철학을 경험한 사용자가 컬렉션과 제품을 이해하고 후기·이벤트·멤버십을 거쳐 구매로 이어지도록 전체 여정을 정의했습니다.'],
        ['B / EXPERIENCE ARCHITECTURE','아임웹 운영 기반과 커스텀 브랜드 화면을 분리했습니다.','CMS와 상품 운영은 빌더의 장점을 활용하고 주요 브랜드 화면과 인터랙션은 커스텀 코드로 구현해 표현력과 운영성을 함께 확보했습니다.'],
        ['C / VISUAL & DEVELOPMENT STACK','이미지 제작·촬영·코드를 하나의 아트디렉션으로 연결했습니다.','웹 비주얼, 제품 촬영, 상세페이지와 HTML·CSS·JavaScript 구현을 동일한 브랜드 기준으로 묶어 화면 완성도를 높였습니다.'],
        ['D / INFORMATION ARCHITECTURE','브랜드·컬렉션·제품·회원 접점을 역할별로 정리했습니다.','브랜드 소개와 제품 탐색, 리뷰, 이벤트, 멤버십과 구매 기능을 사용 목적에 따라 분리하면서 하나의 흐름으로 연결했습니다.'],
        ['E / COMMERCE FLOW','브랜드 인상에서 실제 구매까지 전환 구조를 만들었습니다.','컬렉션 탐색, 상세 콘텐츠, 후기와 프로모션, 회원 혜택을 거쳐 실제 상품 구매 기능으로 자연스럽게 진입하도록 설계했습니다.'],
        ['F / CONTENT & COMMERCE STRUCTURE','촬영·상세페이지와 운영 기능을 역할별로 나눴습니다.','브랜드 콘텐츠와 제품 상세는 직접 제작하고 리뷰·이벤트·멤버십·상품 운영은 아임웹 기능과 커스텀 화면을 조합해 관리 가능하게 구성했습니다.'],
        ['G / OPERATION & DELIVERY','상품 세팅과 구매 시스템까지 실제 판매 가능한 상태로 마무리했습니다.','웹 구현에서 끝내지 않고 제품 상세 세팅, 회원·이벤트 운영과 구매 기능을 연결해 브랜드가 지속적으로 운영할 수 있는 커머스 환경을 완성했습니다.']
      ]
    }
  };

  const apply = () => {
    const system = document.querySelector('.dev-case-system');
    if (!system) return false;
    if (system.dataset.extraDevelopCopy === workId) return true;
    const config = configs[workId];
    const title = system.querySelector('.dev-case-system__title');
    if (title) title.textContent = config.title;
    const headings = Array.from(system.querySelectorAll('.dev-case-heading'));
    if (headings.length < 7) return false;
    config.headings.forEach((data,index)=>rewriteHeading(headings[index],...data));
    system.dataset.extraDevelopCopy = workId;
    return true;
  };

  if (apply()) return;
  const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.setTimeout(()=>observer.disconnect(),5000);
})();