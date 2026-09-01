(() => {
  const root = document.querySelector('[data-brand-process]');
  if (!root || !document.body.classList.contains('package-design-page')) return;

  const info = {
    '01': {
      title: '제품과 패키지에 필요한 기본 정보부터 정리합니다.',
      description: '제품명, 용량, 판매 채널과 패키지에 들어갈 필수 정보를 먼저 확인합니다. 기존 브랜드 자료와 제작 자료가 있다면 함께 검토해 디자인을 시작할 기준을 맞춥니다.',
      doing: [
        ['제품 기본정보 확인', '제품명·용량·규격·판매 채널 등 디자인에 필요한 기본 정보를 확인합니다.'],
        ['필수 표기 원고 확인', '법정 표기, 바코드, 인증 정보 등 클라이언트가 제공하는 표기 원고를 정리합니다.'],
        ['기존 자료 확인', '로고, 기존 패키지, 제작사 자료와 참고 이미지를 함께 확인합니다.']
      ],
      output: [
        ['Package Brief', '제품과 패키지 요구사항을 정리한 작업 기준'],
        ['Information Checklist', '패키지에 반영할 필수 정보 목록']
      ]
    },
    '02': {
      title: '디자인이 올라갈 규격과 제작 조건을 먼저 맞춥니다.',
      description: '패키지 형태와 규격, 기존 칼선 유무를 확인하고 디자인 작업에 사용할 기준선을 정리합니다. 소재나 후가공이 정해져 있는 경우 해당 조건도 함께 반영합니다.',
      doing: [
        ['형태와 규격 확인', '단상자·라벨·파우치 등 패키지 형태와 실제 제작 규격을 확인합니다.'],
        ['칼선 확인', '제작사 제공 칼선이나 기존 칼선을 기준으로 디자인 작업용 도면을 정리합니다.'],
        ['제작 조건 정리', '소재, 인쇄 방식, 별색과 후가공 등 디자인에 영향을 주는 조건을 확인합니다.']
      ],
      output: [
        ['Package Spec', '규격과 주요 제작 조건을 정리한 기준'],
        ['Working Dieline', '디자인 작업에 사용하는 패키지 칼선']
      ]
    },
    '03': {
      title: '패키지가 어떤 인상과 정보 순서를 가져야 하는지 정합니다.',
      description: '브랜드와 제품의 성격을 기준으로 패키지의 시각 방향과 정보 우선순위를 정합니다. 필요한 경우 경쟁 제품과 진열 환경을 참고해 디자인의 중심 방향을 좁혀갑니다.',
      doing: [
        ['디자인 레퍼런스 검토', '브랜드와 제품에 적합한 패키지 표현 방향을 함께 확인합니다.'],
        ['정보 우선순위 설정', '전면에서 먼저 보여야 할 제품명, 특징과 정보 순서를 정합니다.'],
        ['디자인 방향 설정', '컬러, 그래픽, 이미지와 레이아웃의 기본 방향을 정리합니다.']
      ],
      output: [
        ['Design Direction', '패키지 디자인의 시각 방향'],
        ['Layout Draft', '주요 정보 배치와 면 구성 초안']
      ]
    },
    '04': {
      title: '확정된 방향을 실제 패키지 도안으로 개발합니다.',
      description: '전면의 브랜드 표현과 제품명, 측면·후면의 필수 정보를 칼선 위에 배치해 실제 패키지 도안을 완성합니다. 제품군이 여러 개인 경우 계약 범위에 따라 베리에이션을 함께 전개합니다.',
      doing: [
        ['전면 디자인 개발', '브랜드와 제품의 핵심 인상이 가장 잘 보이도록 전면 도안을 개발합니다.'],
        ['정보 영역 구성', '측면과 후면의 제품 정보, 표기 원고와 바코드 영역을 정리합니다.'],
        ['제품군 확장', '복수 제품이 포함된 경우 컬러와 그래픽 규칙을 적용해 시리즈를 전개합니다.']
      ],
      output: [
        ['Package Artwork', '확정된 패키지 디자인 도안'],
        ['Variant Artwork', '제품군 또는 옵션별 추가 도안 · 해당 시']
      ]
    },
    '05': {
      title: '패키지 샘플 검토는 요청 시 진행합니다.',
      description: '샘플 제작이 필요한 프로젝트는 별도 요청 또는 제작 연계 범위에 따라 목업·실물 샘플을 확인합니다. 크기, 접힘, 컬러와 후가공을 검토하고 필요한 부분만 최종 도안에 반영합니다.',
      doing: [
        ['샘플 진행 여부 확인', '프로젝트 일정과 제작 조건에 따라 샘플 진행 여부를 먼저 협의합니다.'],
        ['목업·실물 확인', '요청 시 제작된 샘플에서 크기, 접힘, 색상과 후가공 상태를 확인합니다.'],
        ['필요 수정 반영', '샘플에서 확인된 문제만 최종 도안에 반영해 제작 데이터를 조정합니다.']
      ],
      output: [
        ['Sample Review', '요청 시 진행한 샘플 검토 결과'],
        ['Revised Artwork', '샘플 검토 후 수정된 도안 · 필요 시']
      ]
    },
    '06': {
      title: '최종 도안과 칼선을 정리하고, 생산 연계 시 제작까지 연결합니다.',
      description: '확정된 패키지 도안과 칼선을 인쇄용 최종 데이터로 정리합니다. 나인웍스에서 생산까지 연계하는 프로젝트는 최종 사양을 제작처와 공유하고 발주·생산 단계로 이어갑니다.',
      doing: [
        ['최종 도안 정리', '확정된 디자인을 인쇄용 데이터 기준에 맞춰 마감합니다.'],
        ['칼선·후가공 정리', '칼선과 별색, 박, 형압 등 필요한 제작 레이어를 구분합니다.'],
        ['생산 연계', '생산 연계 프로젝트에 한해 제작처 전달과 발주 준비를 이어서 진행합니다.']
      ],
      output: [
        ['Final Artwork', '인쇄용 최종 패키지 도안'],
        ['Final Dieline', '최종 제작용 칼선 데이터']
      ]
    }
  };

  const makeList = (items) => `
    <ul class="process-info-list">
      ${items.map((item, index) => `
        <li>
          <span class="process-info-list__index">${String(index + 1).padStart(2, '0')}</span>
          <span class="process-info-list__body"><strong>${item[0]}</strong><small>${item[1]}</small></span>
        </li>`).join('')}
    </ul>`;

  root.querySelectorAll('[data-process-step]').forEach((step) => {
    const data = info[step.dataset.processStep];
    if (!data) return;

    const description = step.querySelector('.brand-step__description');
    if (description) description.textContent = data.description;

    const visual = step.querySelector('.brand-step__visual');
    if (!visual) return;
    visual.removeAttribute('aria-hidden');
    visual.className = 'brand-step__visual process-info-visual';
    visual.innerHTML = `
      <div class="process-info-panel">
        <div class="process-info-panel__head">
          <small>STEP ${step.dataset.processStep} / PACKAGE PROCESS</small>
          <strong>${data.title}</strong>
        </div>
        <div class="process-info-panel__grid">
          <section class="process-info-column">
            <div class="process-info-column__label"><span>진행 내용</span><span>WHAT WE DO</span></div>
            ${makeList(data.doing)}
          </section>
          <section class="process-info-column process-info-output">
            <div class="process-info-column__label"><span>주요 산출물</span><span>WHAT YOU GET</span></div>
            ${makeList(data.output)}
          </section>
        </div>
      </div>`;
  });
})();