# NINEWORKS Inquiry Email Notifications

나인웍스 사이트의 `inquiries` 컬렉션에 신규 문의가 생성되면 Cloud Function `notifyNewInquiryByEmail`이 SMTP를 통해 `info@9works.kr`로 관리자 알림 메일을 직접 발송합니다.

Firebase Trigger Email Extension에는 의존하지 않습니다. SMTP 계정 정보는 소스 코드나 GitHub에 저장하지 않고 Firebase Secret Manager의 `NINEWORKS_SMTP`에만 저장합니다.

## 현재 코드에 반영된 내용

- Firebase project: `nineworks-f414f`
- Firestore source: `inquiries/{inquiryId}`
- Admin recipient: `info@9works.kr`
- Function region: `asia-northeast3` (Seoul)
- Runtime: Node.js 22
- SMTP sender: Nodemailer
- SMTP credentials: Firebase JSON Secret `NINEWORKS_SMTP`
- 고객 이메일이 유효하면 `replyTo`로 지정
- 메일 본문에 회사명, 담당자, 이메일, 연락처, 프로젝트명, 유형, 문의 내용, 전체 입력 내용, 관리자 링크 포함
- `_systemMailLog/inquiry-<inquiryId>`에 발송 상태 기록
- 2nd gen Firestore trigger의 retry 활성화
- 문의 ID별 처리 잠금 및 발송 완료 기록으로 일반적인 중복 이벤트 방지

## 1. Firebase 요금제

Cloud Functions 배포가 가능한 Blaze 요금제인지 확인합니다.

## 2. NINEWORKS Daum SMTP 정보

현재 `info@9works.kr` 메일은 Daum SMTP를 사용합니다.

- SMTP host: `smtp.daum.net`
- SMTP port: `465`
- SSL/TLS: SSL 사용
- `secure`: `true`
- SMTP username: `nineworkscorp`
- 발신 주소: `NINEWORKS <info@9works.kr>`
- SMTP password: Daum에서 생성한 앱 비밀번호

앱 비밀번호는 GitHub 파일이나 채팅에 적지 않습니다.

## 3. Firebase Secret 등록

Firebase CLI 로그인 후 아래 명령을 실행합니다.

```bash
firebase functions:secrets:set NINEWORKS_SMTP --project nineworks-f414f
```

값 입력을 요구하면 아래 JSON에서 `DAUM_APP_PASSWORD` 부분만 실제 Daum 앱 비밀번호로 바꿔 한 줄로 입력합니다.

```json
{"host":"smtp.daum.net","port":465,"secure":true,"user":"nineworkscorp","pass":"DAUM_APP_PASSWORD","from":"NINEWORKS <info@9works.kr>"}
```

## 4. Functions 배포

저장소 루트에서:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions --project nineworks-f414f
```

배포 대상 함수:

```text
notifyNewInquiryByEmail
```

## 5. 테스트

1. `https://9works.kr/contact.html`에서 테스트 문의를 1건 접수합니다.
2. Firestore `inquiries`에 새 문서가 생성되는지 확인합니다.
3. Firestore `_systemMailLog/inquiry-<문의ID>` 문서의 `status`가 `sent`인지 확인합니다.
4. `info@9works.kr` 받은편지함에서 `[9WORKS 신규 문의]` 메일을 확인합니다.
5. 메일에서 회신을 눌렀을 때 문의 고객 이메일이 수신자로 잡히는지 확인합니다.

## 보안

공개 웹사이트는 기존처럼 `inquiries` 컬렉션에만 문의를 생성합니다. SMTP 비밀번호는 브라우저나 GitHub에 노출되지 않으며 Cloud Function에 바인딩된 Firebase Secret에서만 읽습니다. 메일 수신자는 서버 코드에서 `info@9works.kr`로 고정되어 있어 방문자가 임의의 주소로 메일을 발송할 수 없습니다.
