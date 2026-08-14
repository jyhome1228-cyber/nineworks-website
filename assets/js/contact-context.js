(() => {
  const guide = document.querySelector('.contact-guide');
  if (guide && !guide.querySelector('.contact-directory-restored')) {
    const directory = document.createElement('dl');
    directory.className = 'contact-directory-restored';
    directory.innerHTML = `
      <div><dt>Phone</dt><dd><a href="tel:01054225650">010-5422-5650</a></dd></div>
      <div><dt>Email</dt><dd><a href="mailto:info@9works.kr">info@9works.kr</a></dd></div>
      <div><dt>Office</dt><dd>인천광역시 서구 원당대로 1039, 태경타워 916호</dd></div>
      <div><dt>Response</dt><dd>문의 검토 후 영업일 기준 2–3일 이내 회신</dd></div>`;
    const response = guide.querySelector('.contact-response');
    guide.insertBefore(directory, response || null);
    const note = document.createElement('p');
    note.className = 'contact-extra-note';
    note.textContent = '브랜딩, 웹·시스템 구축, 패키지·인쇄 제작을 단독 또는 연계 프로젝트로 진행할 수 있습니다. 필요한 결과물이 아직 확정되지 않은 단계에서도 상담 가능합니다.';
    guide.appendChild(note);
  }

  const fields = document.querySelector('.contact-fields');
  if (fields && !fields.querySelector('[data-restored-project-name]')) {
    const project = document.createElement('div');
    project.className = 'contact-field contact-field--wide';
    project.dataset.restoredProjectName = 'true';
    project.innerHTML = '<label for="projectNameRestored">프로젝트명</label><input id="projectNameRestored" name="프로젝트명" placeholder="예: 신규 브랜드 론칭 / 홈페이지 리뉴얼">';
    const choice = fields.querySelector('.contact-choice');
    fields.insertBefore(project, choice || null);

    const requirements = fields.querySelector('#requirements')?.closest('.contact-field');
    if (requirements) {
      const situation = document.createElement('div');
      situation.className = 'contact-field-restored';
      situation.innerHTML = '<label for="situationRestored">프로젝트 배경 및 현재 상황</label><textarea id="situationRestored" name="현재상황" placeholder="현재 문제, 준비된 자료, 해결하고 싶은 부분 등을 자유롭게 작성해 주세요."></textarea>';
      requirements.insertAdjacentElement('afterend', situation);
    }

    const schedule = document.createElement('div');
    schedule.className = 'contact-restored-grid';
    schedule.innerHTML = '<div class="contact-field-restored"><label for="statusRestored">현재 진행 상태</label><select id="statusRestored" name="진행상태"><option value="">진행 상태 선택</option><option>아이디어 / 기획 단계</option><option>브랜드 론칭 준비 중</option><option>기존 브랜드 리뉴얼</option><option>제품 출시 준비 중</option><option>운영 중 / 추가 작업 필요</option></select></div><div class="contact-field-restored"><label for="startRestored">작업 시작 희망일</label><input id="startRestored" name="시작희망일" type="date"></div>';
    fields.appendChild(schedule);
  }

  const form = document.querySelector('.contact-panel');
  if (form && !form.querySelector('.contact-consent-restored')) {
    const submit = form.querySelector('.contact-submit');
    const consent = document.createElement('label');
    consent.className = 'contact-consent-restored';
    consent.innerHTML = '<input type="checkbox" name="개인정보동의" value="동의" required><span><a href="privacy.html" target="_blank" rel="noopener">개인정보 처리방침</a>에 동의합니다. *</span>';
    form.insertBefore(consent, submit || null);
  }
})();
