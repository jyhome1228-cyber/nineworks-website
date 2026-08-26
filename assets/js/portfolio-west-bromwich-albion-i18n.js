(() => {
  const body = document.querySelector('.portfolio-wba-page');
  if (!body) return;

  const sidebarTop = body.querySelector('.portfolio-detail-sidebar__top');
  if (!sidebarTop) return;

  const style = document.createElement('style');
  style.textContent = `
    .wba-language-tools{margin-top:18px;display:grid;gap:10px}
    .wba-language-toggle{display:grid;grid-template-columns:1fr 1fr;border:1px solid #cbd3de;max-width:190px}
    .wba-language-toggle button{appearance:none;border:0;background:#fff;color:#7b8795;min-height:34px;padding:0 12px;font:inherit;font-size:9.5px;font-weight:750;letter-spacing:.09em;cursor:pointer}
    .wba-language-toggle button+button{border-left:1px solid #cbd3de}
    .wba-language-toggle button.is-active{background:var(--wba-navy);color:#fff}
    .wba-status-note{max-width:360px;padding:11px 0 0;border-top:1px solid #d9dee6;color:#737f8e;font-size:10.5px;line-height:1.6}
    .wba-status-note strong{display:block;margin-bottom:3px;color:var(--wba-navy);font-size:9px;letter-spacing:.08em;text-transform:uppercase}
    .portfolio-wba-page[data-wba-language="ko"] .wba-proposal-badge{letter-spacing:0}
    @media(max-width:760px){.wba-language-toggle{max-width:none}.wba-language-toggle button{min-height:38px}.wba-status-note{max-width:none}}
  `;
  document.head.appendChild(style);

  const languageTools = document.createElement('div');
  languageTools.className = 'wba-language-tools';
  languageTools.innerHTML = `
    <div class="wba-language-toggle" role="group" aria-label="Language selection">
      <button type="button" data-wba-lang="en" class="is-active" aria-pressed="true">ENGLISH</button>
      <button type="button" data-wba-lang="ko" aria-pressed="false">한국어</button>
    </div>
    <div class="wba-status-note" data-wba-status></div>`;

  const proposalBadge = sidebarTop.querySelector('.wba-proposal-badge');
  if (proposalBadge) proposalBadge.insertAdjacentElement('afterend', languageTools);
  else sidebarTop.appendChild(languageTools);

  const bindings = [];
  const bindText = (el, en, ko) => { if (el) bindings.push({ el, en, ko, html: false }); };
  const bindHTML = (el, en, ko) => { if (el) bindings.push({ el, en, ko, html: true }); };
  const bindList = (selector, pairs, html = false) => {
    const nodes = Array.from(body.querySelectorAll(selector));
    pairs.forEach((pair, index) => {
      const el = nodes[index];
      if (!el) return;
      (html ? bindHTML : bindText)(el, pair[0], pair[1]);
    });
  };

  bindText(proposalBadge, 'Independent Concept Proposal', '독립 리브랜딩 제안');
  bindText(body.querySelector('.portfolio-detail-kicker'), 'Branding / Sports Identity', '브랜딩 / 스포츠 아이덴티티');
  bindText(body.querySelector('.portfolio-detail-scope'), 'Independent Rebranding Concept Proposal · Heritage Identity · Crest & Secondary Mark · Club Applications', '독립 리브랜딩 컨셉 제안 · 헤리티지 아이덴티티 · 크레스트 및 세컨더리 마크 · 클럽 응용');
  bindText(body.querySelector('.portfolio-detail-live span:first-child'), 'VIEW CASE STUDY', '프로젝트 보기');

  bindHTML(body.querySelector('.portfolio-detail-story__lead'), 'HERITAGE, REFINED.<br>ALBION, REDEFINED.', '헤리티지를 정제하고,<br>ALBION을 다시 선명하게.');
  bindText(body.querySelector('.portfolio-detail-story__summary'), 'A conceptual identity renewal that preserves Albion’s most recognisable heritage — the Throstle, Hawthorn, Navy & White stripes and the name ALBION — while refining how those assets work across contemporary football culture.', 'Throstle, Hawthorn, Navy & White Stripes, 그리고 ALBION이라는 이름처럼 클럽이 이미 보유한 강력한 헤리티지를 유지하면서 오늘의 축구 문화 안에서 더 명확하게 작동하도록 정제한 독립 리브랜딩 제안입니다.');

  bindList('.portfolio-detail-facts dt', [
    ['Project','프로젝트'],['Subject','대상'],['Scope','범위'],['Role','역할'],['Status','상태'],['Year','연도']
  ]);
  bindList('.portfolio-detail-facts dd', [
    ['Independent Rebranding Concept Proposal','독립 리브랜딩 컨셉 제안'],
    ['West Bromwich Albion Football Club','West Bromwich Albion Football Club'],
    ['Research · Strategy · Crest Renewal · Secondary Mark · Color System · Kit · Stadium · Merchandise · Digital Applications','리서치 · 전략 · 크레스트 리뉴얼 · 세컨더리 마크 · 컬러 시스템 · 유니폼 · 경기장 · 머천다이즈 · 디지털 응용'],
    ['Research · Strategy · Identity Design · Art Direction / NINEWORKS','리서치 · 전략 · 아이덴티티 디자인 · 아트디렉션 / NINEWORKS'],
    ['Self-initiated / Uncommissioned Proposal','자체 제안 / 비의뢰 프로젝트'],['2026','2026']
  ]);

  bindList('.portfolio-detail-index a', [
    ['Project Overview','프로젝트 개요'],['1878 — The Beginning','1878 — 시작'],['The Throstle','Throstle'],['The Hawthorn','Hawthorn'],['Navy & White','Navy & White'],['Why Rebrand?','왜 리브랜딩인가'],['Rebranding Focus','리브랜딩 방향'],['The New Crest','새로운 Crest'],['Throstle Mark','Throstle Mark'],['Identity System','아이덴티티 시스템'],['Applications','적용 사례']
  ]);
  bindText(body.querySelector('.portfolio-detail-back'), '← Back to Project', '← 프로젝트 목록으로');

  bindList('.wba-hero-note span', [
    ['West Bromwich Albion · Independent Rebranding Concept Proposal','West Bromwich Albion · 독립 리브랜딩 컨셉 제안'],
    ['Heritage, Refined. Albion, Redefined.','헤리티지를 정제하고, Albion을 다시 선명하게.']
  ]);

  bindText(body.querySelector('.wba-band-label'), 'Project Overview / Independent Proposal', '프로젝트 개요 / 독립 제안');
  bindHTML(body.querySelector('.wba-intro-band h2'), 'HERITAGE, REFINED.<br>ALBION, REDEFINED.', '헤리티지를 정제하고,<br>ALBION을 다시 선명하게.');
  bindText(body.querySelector('.wba-intro-lead'), 'West Bromwich Albion already owns a distinctive visual language: the Throstle, the Hawthorn, Navy & White stripes and more than a century of club memory. This proposal does not attempt to replace that heritage. It asks how the same story can become clearer, stronger and more flexible across today’s stadium, kit, merchandise and digital environments.', 'West Bromwich Albion은 Throstle, Hawthorn, Navy & White Stripes 그리고 한 세기가 넘는 클럽의 기억이라는 분명한 시각 자산을 이미 갖고 있습니다. 이 제안은 그 헤리티지를 교체하려는 작업이 아니라, 같은 이야기가 오늘날의 경기장·유니폼·머천다이즈·디지털 환경에서 어떻게 더 명확하고 강하게 작동할 수 있는지를 탐구합니다.');
  const introKo = body.querySelector('.wba-intro-ko');
  if (introKo) introKo.hidden = true;

  bindList('.wba-context-card small', [
    ['HERITAGE','헤리티지'],['REFINEMENT','정제'],['SYSTEM','시스템']
  ]);
  bindList('.wba-context-card strong', [
    ['Keep what makes Albion unmistakable.','Albion을 Albion답게 만드는 것을 남깁니다.'],
    ['Reduce detail, not meaning.','의미가 아닌 디테일을 줄입니다.'],
    ['Move from one crest to one identity.','하나의 Crest에서 하나의 Identity로 확장합니다.']
  ]);
  bindList('.wba-context-card p', [
    ['Throstle, Hawthorn, stripes and the club name remain the foundation.','Throstle, Hawthorn, Stripes와 클럽의 이름을 핵심 기반으로 유지합니다.'],
    ['Complexity is removed only where it improves recognition and consistency.','인지성과 일관성을 높이는 범위 안에서만 복잡성을 줄입니다.'],
    ['The crest, symbol, stripes and wordmark operate together across every touchpoint.','Crest, Symbol, Stripes, Wordmark가 모든 접점에서 하나의 체계로 작동합니다.']
  ]);
  bindList('.wba-concept-line span', [
    ['Preservation through Simplification','단순화를 통한 보존'],['Less Detail. More Albion.','디테일은 줄이고, Albion은 더 선명하게.']
  ]);

  const sections = {
    beginning: {
      label:['1878 — The Beginning','1878 — 시작'],
      title:['Born in West Bromwich. Carried forward as Albion.','West Bromwich에서 시작된 클럽, 세대를 거쳐 이어진 Albion.'],
      copy:[
        '<p>The club that became West Bromwich Albion was formed in West Bromwich in 1878. Its earliest pioneers were known as West Bromwich Strollers before the club took on the Albion name. From that local beginning, the club grew with its community and built a football identity inseparable from place, supporters and matchday culture.</p><p>The central question is therefore not how to reinvent Albion, but how a club born in West Bromwich can carry its history and symbols into the next generation while keeping <strong>Albion</strong> as its clearest shared identity.</p>',
        '<p>오늘의 West Bromwich Albion으로 이어진 클럽은 1878년 West Bromwich에서 시작했습니다. 초기에는 <strong>West Bromwich Strollers</strong>로 불렸고, 이후 <strong>Albion</strong>이라는 이름을 받아들이며 지역 공동체와 함께 성장했습니다. 장소와 서포터, 매치데이 문화가 축적되면서 지금의 클럽 정체성이 만들어졌습니다.</p><p>따라서 이 제안의 핵심 질문은 <strong>“West Bromwich에서 시작된 클럽의 역사와 상징을, ‘Albion’이라는 정체성을 중심으로 다음 세대에 어떻게 더 선명하게 전달할 것인가.”</strong>입니다. West Bromwich는 클럽의 출발점이자 장소이고, Albion은 세대를 거쳐 이어져 온 클럽의 이름과 정체성입니다.</p>'
      ]
    },
    throstle: {
      label:['The Throstle','Throstle'],
      title:['A symbol of Albion — preserved through a clearer silhouette.','Albion의 상징을 더 선명한 실루엣으로 계승합니다.'],
      copy:[
        '<p>The Throstle — a Black Country term for the song thrush — has been associated with Albion since the nineteenth century and remains one of the club’s most direct identifiers. Rather than turning the bird into a generic sports icon, the proposal keeps the recognisable upward posture, spotted chest, wing character and relationship with the branch while reducing unnecessary visual noise.</p><p>The bird is more than a mascot. It connects Club / Team / Supporters / Albion in one historic symbol. Detail is reduced, but the posture and silhouette remain recognisably Albion.</p>',
        '<p>Throstle은 song thrush를 뜻하는 Black Country 지역 표현으로, 19세기부터 Albion과 연결되어 온 클럽의 가장 직접적인 상징 중 하나입니다. 이 제안은 새를 흔한 스포츠 아이콘으로 바꾸는 대신 위를 향한 자세, 가슴의 점무늬, 날개의 특징과 가지와의 관계를 유지하면서 불필요한 시각적 소음을 줄였습니다.</p><p>새는 단순한 마스코트가 아니라 Club / Team / Supporters / Albion을 하나로 연결하는 역사적 상징입니다. 디테일은 줄이되 처음 보는 순간에도 ‘Albion의 새’로 읽히는 자세와 실루엣은 유지합니다.</p>'
      ]
    },
    hawthorn: {
      label:['The Hawthorn','Hawthorn'],
      title:['The club standing on its home.','클럽이 자신의 홈 위에 서 있습니다.'],
      copy:[
        '<p>The Hawthorns has been Albion’s home since 1900, and the hawthorn beneath the Throstle creates a rare relationship between emblem and place. Removing it would make the mark simpler, but also less specific. The proposal therefore keeps the Hawthorn while reducing leaves, berries and small details so the idea remains legible at every scale.</p><p>If the Throstle represents the Club, the Hawthorn represents Home. Together, they complete the story of West Bromwich Albion.</p>',
        '<p>The Hawthorns는 1900년부터 Albion의 홈이었으며, Throstle 아래의 Hawthorn은 상징과 장소가 연결되는 특별한 구조를 만듭니다. 이를 제거하면 형태는 단순해지지만 Albion만의 구체성도 함께 약해집니다. 따라서 Hawthorn을 유지하되 잎, 열매와 작은 디테일을 정리해 모든 크기에서 읽히도록 제안했습니다.</p><p>Throstle이 Club을 의미한다면 Hawthorn은 Home을 의미합니다. 두 상징이 함께 있을 때 비로소 <strong>West Bromwich Albion</strong>이라는 장소성과 클럽의 이야기가 완성됩니다.</p>'
      ]
    },
    colour: {
      label:['Navy & White','Navy & White'],
      title:['More than colour. A matchday memory.','컬러를 넘어, Matchday의 기억으로.'],
      copy:[
        '<p>Navy and white stripes are among Albion’s strongest visual assets. Instead of adding a new palette to signal modernity, this proposal strengthens what supporters already recognise. The previous naturalistic brown, green and red details are removed from the core identity so the crest and secondary mark can operate as a unified Navy & White system.</p><p>The stripes are more than a graphic pattern. They are a memory of Home Kit / Match Day / Albion.</p>',
        '<p>Navy와 White의 세로 스트라이프는 Albion의 가장 강력한 시각 자산 중 하나입니다. 현대성을 표현하기 위해 새로운 컬러를 추가하는 대신 팬들이 이미 인식하고 있는 컬러를 더 강하게 사용합니다. 기존의 자연주의적 Brown / Green / Red 디테일은 핵심 아이덴티티에서 제거해 Crest와 Secondary Mark가 하나의 Navy & White 시스템으로 작동하도록 합니다.</p><p>스트라이프는 단순한 그래픽 패턴보다 Home Kit / Match Day / Albion을 동시에 떠올리게 하는 기억에 가깝습니다.</p>'
      ]
    },
    challenge: {
      label:['Why Rebrand?','왜 리브랜딩인가'],
      title:['Keep the story. Change the way the story performs.','이야기는 유지하고, 작동하는 방식을 바꿉니다.'],
      copy:[
        '<p>The existing crest contains meaningful history, but a highly detailed, multi-colour emblem becomes harder to control as the club moves between a shirt badge, mobile icon, broadcast graphic, social avatar, stadium sign and merchandise mark. The opportunity is not to make Albion look less historic — it is to let that history remain recognisable in more environments.</p>',
        '<p>기존 Crest는 풍부한 역사적 이야기를 담고 있지만, 디테일과 컬러가 많은 엠블럼은 유니폼 배지, 모바일 아이콘, 방송 그래픽, 소셜 아바타, 경기장 사인, 머천다이즈처럼 서로 다른 환경에서 일관되게 작동하기 어렵습니다. 목표는 Albion의 역사성을 줄이는 것이 아니라, 더 많은 환경에서도 그 역사가 선명하게 인식되도록 만드는 것입니다.</p>'
      ]
    },
    focus: {
      label:['Rebranding Focus','리브랜딩 방향'],
      title:['KEEP THE STORY.<br>REDUCE THE FORM.','이야기는 남기고,<br>형태는 줄입니다.'],
      copy:[
        '<p><strong>Preservation through Simplification</strong> is the central strategy. Simplification is not used to remove meaning. It is used to make meaning easier to recognise, reproduce and remember.</p><p>Form is reduced not simply to look contemporary, but to allow the meaning to travel more clearly across the modern football environment.</p>',
        '<p><strong>Preservation through Simplification</strong>, 즉 단순화를 통한 보존이 핵심 전략입니다. 단순화는 의미를 없애기 위한 방식이 아니라 의미를 더 쉽게 인식하고, 재현하고, 기억하게 하기 위한 방법입니다.</p><p>형태를 줄이는 이유는 단순히 현대적으로 보이기 위해서가 아니라, 역사적 자산을 계승하면서도 오늘의 축구 브랜드가 요구하는 인지성과 확장성을 확보하기 위해서입니다.</p>'
      ]
    },
    crest: {
      label:['The New Crest','새로운 Crest'],
      title:['Clearly new. Unmistakably Albion.','분명히 새롭지만, 여전히 Albion답게.'],
      copy:[
        '<p>The proposal retains the shield, WEST BROMWICH / ALBION naming, Throstle, Hawthorn and Navy & White stripes. The change happens in proportion, line weight, colour hierarchy and illustration detail. The goal is a crest that feels renewed without breaking the recognition built by the club’s history.</p>',
        '<p>새로운 Crest는 Shield, WEST BROMWICH / ALBION 네이밍, Throstle, Hawthorn과 Navy & White Stripes를 유지합니다. 변화는 비례, 선 굵기, 컬러 위계와 일러스트 디테일에서 일어납니다. 클럽이 오랜 시간 쌓아 온 인지성을 끊지 않으면서도 새롭게 느껴지는 Crest를 목표로 했습니다.</p>'
      ]
    },
    mark: {
      label:['Throstle Mark','Throstle Mark'],
      title:['Crest represents the Club.<br>Throstle represents the Culture.','Crest는 Club을,<br>Throstle은 Culture를 상징합니다.'],
      copy:[
        '<p>A football club no longer communicates through a crest alone. The Throstle and Hawthorn are therefore separated into a secondary mark that can carry Albion’s identity in more informal, expressive and culture-led moments — without replacing the official crest.</p><p>The official Crest carries tradition and authority; the Throstle Mark works more freely across training wear, merchandise, social media, signage, flags and pattern.</p>',
        '<p>오늘날의 축구 클럽은 Crest 하나만으로 커뮤니케이션하지 않습니다. 따라서 Throstle과 Hawthorn을 Secondary Mark로 분리해 공식 Crest를 대체하지 않으면서도 더 비공식적이고 표현적인 클럽 문화 속에서 Albion의 정체성을 확장하도록 제안합니다.</p><p>공식성과 전통을 담당하는 Crest와, 훈련복·굿즈·소셜·사인·플래그·패턴 등에서 더 자유롭게 작동하는 Throstle Mark를 분리합니다.</p>'
      ]
    },
    system: {
      label:['Identity System','아이덴티티 시스템'],
      title:['From one crest to one club identity system.','하나의 Crest에서 하나의 Club Identity System으로.'],
      copy:[
        '<p>ALBION is treated as a verbal asset as strong as the graphic marks. Together, Crest / Throstle / Stripes / Albion create a system in which each element has a clear role and can appear independently without losing the connection to the club.</p><p>Within the full name West Bromwich Albion, ALBION becomes the most direct verbal link between club and supporters.</p>',
        '<p>ALBION은 그래픽 마크만큼 강력한 언어적 자산으로 다룹니다. Crest / Throstle / Stripes / Albion은 각각 명확한 역할을 갖고 독립적으로 사용되어도 클럽과의 연결을 잃지 않는 하나의 시스템을 구성합니다.</p><p>West Bromwich Albion이라는 긴 이름 가운데 팬과 클럽을 가장 직접적으로 연결하는 단어인 <strong>ALBION</strong>의 존재감을 강화합니다.</p>'
      ]
    },
    applications: {
      label:['Brand Applications','브랜드 적용'],
      title:['Designed to live beyond the badge.','Badge를 넘어 실제 클럽 문화에서 작동하도록.'],
      copy:[
        '<p>The value of the system is tested through application. Primary and secondary marks, Navy & White contrast, stripes and ALBION are allowed to shift in hierarchy depending on the environment while retaining one recognisable visual language.</p>',
        '<p>아이덴티티 시스템의 가치는 실제 적용에서 검증됩니다. Primary / Secondary Mark, Navy & White의 대비, Stripes와 ALBION은 환경에 따라 위계를 바꾸면서도 하나의 일관된 시각 언어를 유지하도록 설계했습니다.</p>'
      ]
    }
  };

  Object.entries(sections).forEach(([id, data]) => {
    const section = body.querySelector(`#${id}`);
    if (!section) return;
    bindText(section.querySelector('.portfolio-scroll-section__label'), data.label[0], data.label[1]);
    bindHTML(section.querySelector('.portfolio-scroll-section__head h2'), data.title[0], data.title[1]);
    bindHTML(section.querySelector('.portfolio-scroll-copy'), data.copy[0], data.copy[1]);
  });

  bindList('.wba-meaning-card small', [
    ['THROSTLE','THROSTLE'],['HAWTHORN','HAWTHORN'],['TOGETHER','함께'],['KEEP','유지'],['KEEP','유지'],['REFINE','정제']
  ]);
  bindList('.wba-meaning-card strong', [
    ['Club','Club'],['Home','Home'],['West Bromwich Albion','West Bromwich Albion'],['Shield / Name / Throstle','Shield / Name / Throstle'],['Hawthorn / Stripes','Hawthorn / Stripes'],['Colour / Detail / Proportion','컬러 / 디테일 / 비례']
  ]);
  bindList('.wba-meaning-card p', [
    ['The historic bird becomes the clearest sign of Albion itself.','역사적 새 상징은 Albion 자체를 가장 직접적으로 보여주는 마크가 됩니다.'],
    ['The tree links the identity directly to The Hawthorns and its place.','Hawthorn은 아이덴티티를 The Hawthorns라는 장소와 직접 연결합니다.'],
    ['Club and home remain one continuous story rather than separate graphic devices.','Club과 Home이 서로 분리된 그래픽이 아니라 하나의 연속된 이야기로 남습니다.'],
    ['The recognisable architecture of the club badge remains visible.','팬들이 기억하는 클럽 배지의 구조는 유지합니다.'],
    ['Home and kit heritage remain embedded in the crest.','홈구장과 유니폼의 헤리티지를 Crest 안에 유지합니다.'],
    ['Fewer colours, cleaner illustration and stronger balance improve performance.','컬러를 줄이고 일러스트를 정리하며 비례를 강화해 다양한 환경에서의 활용성을 높입니다.']
  ]);

  bindList('.wba-color small', [['ALBION NAVY','ALBION NAVY'],['WHITE','WHITE']]);
  bindList('.wba-color strong', [['Tradition / Authority / Heritage','전통 / 권위 / 헤리티지'],['Clarity','명료함']]);
  bindList('.wba-color p', [['Primary identity, typography, stadium graphics and high-recognition applications.','Primary Identity, Typography, Stadium Graphics 등 높은 인지성이 필요한 적용에 사용합니다.'],['Contrast / Modernity / Space','대비 / 현대성 / 여백']]);

  bindList('.wba-ba-column small', [['BEFORE / CREST-LED','BEFORE / CREST 중심'],['AFTER / SYSTEM-LED','AFTER / SYSTEM 중심']]);
  bindList('.wba-ba-column h3', [['Rich story, limited flexibility.','풍부한 이야기, 제한적인 확장성.'],['Same story, clearer hierarchy.','같은 이야기, 더 명확한 위계.']]);
  bindList('.wba-ba-column li', [
    ['Multiple naturalistic colours','다수의 자연주의적 컬러'],['Detailed bird illustration','세밀한 새 일러스트'],['Complex Hawthorn construction','복잡한 Hawthorn 구조'],['Detail loss at small sizes','작은 크기에서 디테일 손실'],['One crest carrying every role','하나의 Crest가 모든 역할 담당'],
    ['Navy / White core system','Navy / White 핵심 시스템'],['Clearer Throstle silhouette','더 선명한 Throstle 실루엣'],['Reduced Hawthorn detail','정리된 Hawthorn 디테일'],['Improved small-scale recognition','작은 크기에서도 강화된 인지성'],['Primary and secondary identities','Primary / Secondary Identity 분리']
  ]);

  bindList('.wba-principle strong', [['Preserve','계승'],['Reduce','정리'],['Clarify','명료화'],['Expand','확장']]);
  bindList('.wba-principle p', [
    ['Albion의 역사적 상징과 팬이 기억하는 구조를 계승합니다.','Albion의 역사적 상징과 팬이 기억하는 구조를 계승합니다.'],
    ['불필요한 색과 세부 묘사를 줄여 형태의 핵심을 남깁니다.','불필요한 색과 세부 묘사를 줄여 형태의 핵심을 남깁니다.'],
    ['작은 크기에서도 즉시 WBA로 인식되는 실루엣을 만듭니다.','작은 크기에서도 즉시 WBA로 인식되는 실루엣을 만듭니다.'],
    ['유니폼, 경기장, 디지털과 굿즈에서 동일하게 작동하도록 합니다.','유니폼, 경기장, 디지털과 굿즈에서 동일하게 작동하도록 합니다.']
  ]);

  bindList('.wba-role small', [['PRIMARY CREST / TRADITION','PRIMARY CREST / 전통'],['THROSTLE MARK / CULTURE','THROSTLE MARK / 문화']]);
  bindList('.wba-role strong', [['Official Club Identity','공식 클럽 아이덴티티'],['Contemporary Albion','현대적인 Albion']]);
  bindList('.wba-role p', [['Used where authority, competition and formal representation matter most.','공식성, 대회, 권위 있는 표현이 중요한 환경에서 사용합니다.'],['Used where club culture needs a simpler, more flexible and recognisable sign.','더 간결하고 유연한 상징이 필요한 클럽 문화 영역에서 사용합니다.']]);

  bindList('.wba-system-card strong', [['Tradition','전통'],['Identity','정체성'],['Recognition','인지'],['Voice','목소리']]);
  bindList('.wba-system-card p', [['공식적인 클럽의 얼굴.','공식적인 클럽의 얼굴.'],['클럽을 상징하는 가장 강한 아이콘.','클럽을 상징하는 가장 강한 아이콘.'],['WBA를 즉시 떠올리게 하는 시각적 리듬.','WBA를 즉시 떠올리게 하는 시각적 리듬.'],['팬과 클럽을 연결하는 가장 강력한 이름.','팬과 클럽을 연결하는 가장 강력한 이름.']]);

  bindList('.wba-application-head strong', [['ON THE PITCH','ON THE PITCH'],['AT THE HAWTHORNS','AT THE HAWTHORNS'],['WITH THE SUPPORTERS','WITH THE SUPPORTERS'],['ACROSS CLUB CULTURE','ACROSS CLUB CULTURE']]);
  bindList('.wba-application-head span', [['Kit / Matchday / Club Presence','유니폼 / 매치데이 / 클럽 프레즌스'],['Stadium / Signage / Spatial Identity','경기장 / 사인 / 공간 아이덴티티'],['Merchandise / Flag / Everyday Culture','머천다이즈 / 플래그 / 일상 속 클럽 문화'],['Digital / Content / Graphic Extensions','디지털 / 콘텐츠 / 그래픽 확장']]);

  bindText(body.querySelector('.wba-final small'), 'Final Concept Statement', '최종 컨셉 문장');
  bindHTML(body.querySelector('.wba-final h2'), 'LESS DETAIL.<br>MORE ALBION.', '디테일은 줄이고,<br>ALBION은 더 선명하게.');
  bindText(body.querySelector('.wba-final-en'), 'This identity proposal is not a move away from West Bromwich Albion’s past. It is an attempt to make the symbols built since 1878 — the Throstle, Hawthorn and Navy & White — work with greater clarity inside contemporary football culture.', '이 아이덴티티 제안은 West Bromwich Albion의 과거에서 멀어지기 위한 변화가 아닙니다. 1878년부터 축적된 Throstle, Hawthorn, Navy & White의 상징이 오늘날의 축구 문화 안에서 더 명확하게 작동하도록 만드는 시도입니다.');
  const finalKo = body.querySelector('.wba-final p[lang="ko"]');
  if (finalKo) finalKo.hidden = true;
  bindHTML(body.querySelector('.wba-disclaimer'), '<strong>Independent Concept Notice.</strong> This is a self-initiated design study by NINEWORKS and was not commissioned, endorsed or approved by West Bromwich Albion Football Club. The project remains at proposal stage; implementation has not been confirmed and whether it will proceed is currently under review.', '<strong>독립 컨셉 제안 안내.</strong> 본 작업은 NINEWORKS가 독립적으로 진행한 디자인 제안이며 West Bromwich Albion Football Club의 공식 의뢰, 승인 또는 공식 아이덴티티가 아닙니다. 현재 제안 단계로 실제 진행 및 적용 여부는 확정되지 않았으며 향후 진행 여부를 검토 중입니다.');

  const statusEl = languageTools.querySelector('[data-wba-status]');
  const buttons = Array.from(languageTools.querySelectorAll('[data-wba-lang]'));

  const applyLanguage = (lang) => {
    const ko = lang === 'ko';
    body.dataset.wbaLanguage = lang;
    document.documentElement.lang = ko ? 'ko' : 'en';

    bindings.forEach(({ el, en, ko: koText, html }) => {
      if (!el) return;
      if (html) el.innerHTML = ko ? koText : en;
      else el.textContent = ko ? koText : en;
    });

    if (introKo) introKo.hidden = true;
    if (finalKo) finalKo.hidden = true;

    statusEl.innerHTML = ko
      ? '<strong>PROPOSAL STATUS</strong>제안 단계 프로젝트입니다. 실제 진행 및 적용 여부는 아직 확정되지 않았으며 현재 향후 진행 여부를 검토 중입니다.'
      : '<strong>PROPOSAL STATUS</strong>This project is currently at proposal stage. Implementation has not been confirmed, and whether the project will proceed is currently under review.';

    buttons.forEach((button) => {
      const active = button.dataset.wbaLang === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  buttons.forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.wbaLang || 'en')));
  applyLanguage('en');
})();
