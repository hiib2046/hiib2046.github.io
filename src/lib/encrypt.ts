/*
 * 잠금 글 본문 암호화 (빌드 시점, Node 전용)
 * - 입력: 렌더된 본문 HTML 문자열 + 공용 비밀번호
 * - 출력: base64로 인코딩된 salt / iv / data(암호문+인증태그)
 * - 알고리즘: PBKDF2-SHA256(1.2M) 로 키 유도 → AES-256-GCM 암호화
 *   (브라우저 WebCrypto 의 복호화와 파라미터를 정확히 맞춘다)
 * - 호출 주체: src/pages/blog/[...slug].astro
 */
import crypto from 'node:crypto';

// OWASP 권장치(600k) 의 2배. 클라이언트 WebCrypto 의 iterations 와 반드시 동일해야 한다.
const ITERATIONS = 1_200_000;

export interface EncryptedPayload {
  salt: string;
  iv: string;
  data: string;
}

export function encryptHtml(html: string, password: string): EncryptedPayload {
  // salt·iv 는 매 호출 랜덤 — 같은 글이라도 빌드마다 암호문이 달라진다(dist 는 git 추적 안 함).
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(html, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // WebCrypto 의 AES-GCM 은 인증태그를 암호문 끝에 이어붙인 형태를 기대한다.
  return {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: Buffer.concat([ciphertext, authTag]).toString('base64'),
  };
}
