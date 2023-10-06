export default function urlSafeBase64(originalString) {
  // 문자열을 바이트로 인코딩 (UTF-8 인코딩 사용)
  const utf8Bytes = new TextEncoder().encode(originalString);

  // URL-safe Base64로 인코딩
  const urlSafeBase64 = btoa(String.fromCharCode.apply(null, utf8Bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return urlSafeBase64;
}
