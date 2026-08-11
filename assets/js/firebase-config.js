// NINEWORKS Firebase Web App configuration
// Firebase Console > Project settings > Your apps > Web app 에서 받은 값을 아래에 입력하세요.
// Firebase Web config는 클라이언트 식별 정보이며, 실제 접근 제어는 Security Rules와 Authentication으로 처리합니다.

export const firebaseConfig = Object.freeze({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
});

export const firebaseConfigReady = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
].every((key) => String(firebaseConfig[key] || '').trim().length > 0);
