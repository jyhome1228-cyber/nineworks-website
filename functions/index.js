const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { setGlobalOptions } = require('firebase-functions/v2/options');
const { defineJsonSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const nodemailer = require('nodemailer');

initializeApp();
setGlobalOptions({ region: 'asia-northeast3', maxInstances: 3 });

const ADMIN_EMAIL = 'info@9works.kr';
const SMTP_CONFIG = defineJsonSecret('NINEWORKS_SMTP');
const MAIL_LOCK_MS = 5 * 60 * 1000;

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const clean = (value, max = 5000) => String(value || '').trim().slice(0, max);
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

const formatCreatedAt = (value) => {
  try {
    const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  } catch {
    return '-';
  }
};

const getSmtpConfig = () => {
  const value = SMTP_CONFIG.value() || {};
  const host = clean(value.host, 255);
  const port = Number(value.port || 587);
  const user = clean(value.user, 320);
  const pass = String(value.pass || '');
  const from = clean(value.from, 320) || (validEmail(user) ? `NINEWORKS <${user}>` : 'NINEWORKS <info@9works.kr>');
  const secure = typeof value.secure === 'boolean' ? value.secure : port === 465;

  if (!host || !Number.isFinite(port) || port < 1 || port > 65535 || !user || !pass) {
    throw new Error('NINEWORKS_SMTP secret is incomplete. host, port, user and pass are required.');
  }

  return { host, port, user, pass, from, secure };
};

const claimMailEvent = async ({ db, inquiryId, eventId }) => {
  const ref = db.collection('_systemMailLog').doc(`inquiry-${inquiryId}`);
  const now = Timestamp.now();
  const nowMs = now.toMillis();

  const state = await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const data = snapshot.exists ? snapshot.data() : null;

    if (data?.status === 'sent') return 'sent';

    const claimedAtMs = typeof data?.claimedAt?.toMillis === 'function' ? data.claimedAt.toMillis() : 0;
    if (data?.status === 'sending' && claimedAtMs && nowMs - claimedAtMs < MAIL_LOCK_MS) return 'busy';

    tx.set(ref, {
      status: 'sending',
      inquiryId,
      eventId: clean(eventId, 240),
      claimedAt: now,
      updatedAt: now
    }, { merge: true });
    return 'claimed';
  });

  return { ref, state };
};

exports.notifyNewInquiryByEmail = onDocumentCreated(
  {
    document: 'inquiries/{inquiryId}',
    retry: true,
    secrets: [SMTP_CONFIG]
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const inquiry = snapshot.data() || {};
    const inquiryId = event.params.inquiryId;
    const company = clean(inquiry.company, 200);
    const contactName = clean(inquiry.contactName, 120);
    const email = clean(inquiry.email, 240);
    const phone = clean(inquiry.phone, 80);
    const projectName = clean(inquiry.projectName, 200);
    const projectType = clean(inquiry.projectType, 500);
    const service = clean(inquiry.service, 160);
    const message = clean(inquiry.message, 3000);
    const details = clean(inquiry.details, 15000);
    const source = clean(inquiry.source, 500);
    const createdAt = formatCreatedAt(inquiry.createdAt);

    const db = getFirestore();
    const { ref: mailLogRef, state } = await claimMailEvent({
      db,
      inquiryId,
      eventId: event.id || ''
    });

    if (state === 'sent') {
      logger.info('Inquiry email already sent; duplicate event skipped', { inquiryId });
      return;
    }

    if (state === 'busy') {
      logger.warn('Inquiry email is already being processed; retrying later', { inquiryId });
      throw new Error('Inquiry email is already being processed.');
    }

    const subjectTarget = company || projectName || contactName || service || '새 문의';
    const subject = `[9WORKS 신규 문의] ${subjectTarget}`;

    const text = [
      '[9WORKS 신규 문의]',
      '',
      `회사 / 브랜드: ${company || '-'}`,
      `담당자: ${contactName || '-'}`,
      `이메일: ${email || '-'}`,
      `연락처: ${phone || '-'}`,
      `프로젝트명: ${projectName || '-'}`,
      `문의 유형: ${projectType || service || '-'}`,
      `접수 경로: ${source || '-'}`,
      `접수 시각: ${createdAt}`,
      '',
      '[문의 내용]',
      message || '-',
      '',
      '[전체 입력 내용]',
      details || '-',
      '',
      '관리자 확인: https://9works.kr/admin.html',
      `문의 ID: ${inquiryId}`
    ].join('\n');

    const html = `
      <div style="margin:0;background:#f4f4f1;padding:32px;font-family:Arial,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#111;">
        <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #deded8;">
          <div style="padding:28px 30px;border-bottom:1px solid #e5e5df;">
            <div style="font-size:11px;letter-spacing:.12em;color:#777;margin-bottom:12px;">NINEWORKS / NEW INQUIRY</div>
            <h1 style="font-size:24px;line-height:1.3;margin:0;font-weight:600;">새로운 문의가 접수되었습니다.</h1>
          </div>
          <div style="padding:26px 30px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
              <tr><td style="width:130px;padding:8px 0;color:#777;vertical-align:top;">회사 / 브랜드</td><td style="padding:8px 0;">${escapeHtml(company || '-')}</td></tr>
              <tr><td style="padding:8px 0;color:#777;vertical-align:top;">담당자</td><td style="padding:8px 0;">${escapeHtml(contactName || '-')}</td></tr>
              <tr><td style="padding:8px 0;color:#777;vertical-align:top;">이메일</td><td style="padding:8px 0;">${escapeHtml(email || '-')}</td></tr>
              <tr><td style="padding:8px 0;color:#777;vertical-align:top;">연락처</td><td style="padding:8px 0;">${escapeHtml(phone || '-')}</td></tr>
              <tr><td style="padding:8px 0;color:#777;vertical-align:top;">프로젝트명</td><td style="padding:8px 0;">${escapeHtml(projectName || '-')}</td></tr>
              <tr><td style="padding:8px 0;color:#777;vertical-align:top;">문의 유형</td><td style="padding:8px 0;">${escapeHtml(projectType || service || '-')}</td></tr>
              <tr><td style="padding:8px 0;color:#777;vertical-align:top;">접수 시각</td><td style="padding:8px 0;">${escapeHtml(createdAt)}</td></tr>
            </table>
            <div style="margin-top:24px;padding-top:22px;border-top:1px solid #e5e5df;">
              <div style="font-size:11px;letter-spacing:.08em;color:#777;margin-bottom:10px;">MESSAGE</div>
              <div style="white-space:pre-wrap;font-size:14px;line-height:1.8;">${escapeHtml(message || '-')}</div>
            </div>
            <div style="margin-top:24px;padding-top:22px;border-top:1px solid #e5e5df;">
              <div style="font-size:11px;letter-spacing:.08em;color:#777;margin-bottom:10px;">ALL DETAILS</div>
              <div style="white-space:pre-wrap;font-size:13px;line-height:1.75;color:#444;">${escapeHtml(details || '-')}</div>
            </div>
            <a href="https://9works.kr/admin.html" style="display:inline-block;margin-top:28px;background:#111;color:#fff;text-decoration:none;padding:13px 18px;font-size:13px;font-weight:600;">관리자에서 문의 확인하기 ↗</a>
          </div>
          <div style="padding:18px 30px;border-top:1px solid #e5e5df;color:#888;font-size:11px;line-height:1.6;">
            Inquiry ID: ${escapeHtml(inquiryId)}<br>
            Source: ${escapeHtml(source || '-')}
          </div>
        </div>
      </div>`;

    try {
      const smtp = getSmtpConfig();
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000
      });

      const result = await transporter.sendMail({
        from: smtp.from,
        to: ADMIN_EMAIL,
        replyTo: validEmail(email) ? email : undefined,
        subject,
        text,
        html
      });

      await mailLogRef.set({
        status: 'sent',
        to: ADMIN_EMAIL,
        messageId: clean(result.messageId, 500),
        sentAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }, { merge: true });

      logger.info('Inquiry email sent', { inquiryId, to: ADMIN_EMAIL, messageId: result.messageId });
    } catch (error) {
      const errorMessage = clean(error?.message || String(error), 1200);
      await mailLogRef.set({
        status: 'error',
        lastError: errorMessage,
        updatedAt: Timestamp.now()
      }, { merge: true });

      logger.error('Failed to send inquiry email', { inquiryId, error: errorMessage });
      throw error;
    }
  }
);
