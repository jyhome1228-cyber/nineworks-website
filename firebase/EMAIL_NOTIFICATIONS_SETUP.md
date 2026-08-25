# NINEWORKS Inquiry Email Notifications

나인웍스 사이트의 `inquiries` 컬렉션에 신규 문의가 생성되면 Cloud Function `notifyNewInquiryByEmail`이 `mail/inquiry-<inquiryId>` 문서를 생성합니다.

Firebase Trigger Email 확장이 `mail` 컬렉션을 감지해 `info@9works.kr`로 메일을 발송하도록 구성합니다.

## 현재 코드에 반영된 내용

- Firebase project: `nineworks-f414f`
- Firestore source: `inquiries/{inquiryId}`
- Mail queue collection: `mail`
- Admin recipient: `info@9works.kr`
- Function region: `asia-northeast3` (Seoul)
- Runtime: Node.js 22
- 고객 이메일이 유효하면 `replyTo`로 지정
- 같은 문의 ID의 메일 문서를 다시 만들지 않아 함수 재시도 시 중복 발송 방지

## 1. Firebase 요금제

Cloud Functions 및 Extensions 사용이 가능한 Blaze 요금제인지 확인합니다.

## 2. Trigger Email 확장 설치

Firebase Console > Extensions에서 `Trigger Email` (`firestore-send-email`)을 설치합니다.

설치 설정:

- Email documents collection: `mail`
- Default FROM address: 실제 SMTP 발신이 허용된 나인웍스 메일 주소
- Default REPLY-TO address: `info@9works.kr`
- SMTP connection URI: 사용하는 메일 서비스의 SMTP 값
- SMTP password: Firebase Secret로 입력

메일 발송 서비스는 `info@9works.kr`가 실제로 사용하는 메일 호스팅 또는 별도 트랜잭션 메일 서비스의 SMTP를 사용합니다.

## 3. Functions 배포

저장소 루트에서:

```bash
firebase login
firebase use nineworks-f414f
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 4. 테스트

1. `https://9works.kr/contact.html`에서 테스트 문의를 1건 접수합니다.
2. Firestore `inquiries`에 새 문서가 생성되는지 확인합니다.
3. Firestore `mail`에 `inquiry-<문의ID>` 문서가 생성되는지 확인합니다.
4. Trigger Email 확장이 `delivery.state`를 `SUCCESS`로 변경하는지 확인합니다.
5. `info@9works.kr` 받은편지함에서 `[9WORKS 신규 문의]` 메일을 확인합니다.

## 보안

사이트 클라이언트는 `mail` 컬렉션에 직접 쓰지 않습니다. 공개 문의폼은 기존처럼 `inquiries`에만 생성 권한이 있고, 서버 측 Cloud Function(Admin SDK)만 `mail` 문서를 생성합니다. 따라서 방문자가 임의 수신자에게 메일을 발송하는 구조를 만들지 않습니다.
