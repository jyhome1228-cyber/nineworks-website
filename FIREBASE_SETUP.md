# NINEWORKS Firebase Setup

나인웍스 웹사이트는 GitHub Pages를 그대로 사용하고, 관리자 CMS 데이터만 Firebase Authentication / Cloud Firestore / Cloud Storage로 연결합니다.

## 1. Firebase 프로젝트 + Web App

Firebase Console에서 프로젝트를 생성하거나 기존 프로젝트를 선택한 뒤 Web App을 등록합니다.

Web App 등록 후 제공되는 `firebaseConfig` 값을 아래 파일에 입력합니다.

`assets/js/firebase-config.js`

```js
export const firebaseConfig = Object.freeze({
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...'
});
```

## 2. Authentication

Firebase Console > Authentication에서 Email/Password 로그인 방식을 활성화합니다.

관리자 계정은 공개 회원가입 화면에서 만들지 않고 Firebase Console의 Users 메뉴에서 직접 생성하는 것을 기본으로 합니다.

관리자 사용자를 생성한 뒤 UID를 복사합니다.

## 3. Firestore

Cloud Firestore 데이터베이스를 생성합니다.

관리자 계정 UID와 동일한 문서 ID로 다음 문서를 직접 만듭니다.

Collection: `admins`
Document ID: `<Firebase Authentication UID>`

예시 필드:

```text
role: owner
email: info@9works.kr
name: NINEWORKS Admin
```

관리 예정 컬렉션:

- `portfolios`
- `projects`
- `magazines`
- `inquiries`
- `clients`
- `admins`

## 4. Cloud Storage

Portfolio / Project / Magazine 이미지를 관리자에서 업로드하려면 Cloud Storage 버킷을 생성합니다.

공개 이미지 경로는 `public/`, 관리자 전용 파일은 `private/`를 사용합니다.

## 5. Security Rules

준비된 규칙 파일:

- `firebase/firestore.rules`
- `firebase/storage.rules`

Firebase CLI를 사용하는 경우 저장소 루트에서 아래처럼 배포할 수 있습니다.

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Firebase Console의 Rules 화면에 직접 복사해서 적용해도 됩니다.

## 6. Admin 접속

Firebase 설정값이 비어 있으면 `/admin.html`은 `FIREBASE CONFIG REQUIRED` 상태를 표시합니다.

설정값 입력이 완료되면 관리자 로그인 화면이 활성화됩니다. 로그인 성공 후 Firestore의 `admins/<uid>` 문서가 확인된 계정만 관리자 화면을 사용할 수 있습니다.

## 7. 다음 개발 순서

1. Portfolio CRUD + Storage 이미지 업로드
2. 기존 정적 포트폴리오 데이터 Firebase 마이그레이션
3. Project / Magazine CRUD
4. Contact / Membership / Print / Develop 폼을 `inquiries` 컬렉션에 저장
5. Client 등록 폼과 `clients` 컬렉션 연결
6. App Check / 로그 / 백업 정책 추가
