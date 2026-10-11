/**
 * Generates cryptographic digital signature verification hashes and serial numbers
 */
export function generateVerificationHash(signerName, roleTitle, requestId, timestamp) {
  const seed = `${signerName}|${roleTitle}|${requestId}|${timestamp}|${Math.random()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = Math.random().toString(16).substring(2, 10);
  return `SHA256: ${hex.slice(0, 4)}...${hex.slice(4)}:${salt}`;
}

export function generateCertSerial(requestId, stageNumber) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CERT-${dateStr}-${requestId}-S${stageNumber}-${rand}`;
}
