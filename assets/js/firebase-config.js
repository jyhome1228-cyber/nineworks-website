// NINEWORKS Firebase Web App configuration
// Firebase Web config는 클라이언트 식별 정보이며, 실제 접근 제어는 Security Rules와 Authentication으로 처리합니다.

export const firebaseConfig = Object.freeze({
  apiKey: 'AIzaSyDf0AIgR8wyHzKvohlqrGHBtnetEvsjbrc',
  authDomain: 'nineworks-f414f.firebaseapp.com',
  projectId: 'nineworks-f414f',
  storageBucket: 'nineworks-f414f.firebasestorage.app',
  messagingSenderId: '275963921149',
  appId: '1:275963921149:web:f792008b6b275fd8827494'
});

export const firebaseConfigReady = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
].every((key) => String(firebaseConfig[key] || '').trim().length > 0);
