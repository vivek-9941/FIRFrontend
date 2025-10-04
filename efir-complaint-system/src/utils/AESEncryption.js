import CryptoJS from 'crypto-js';

const secretKey = 'A0bC1dE2fG3hI4jKxYzL5mN6oP7qR8s9';

// Encrypt function
export function encryptAES(plainText) {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString(); // This is Base64-encoded
}

// Decrypt function
export function decryptAES(cipherText) {
    if (!cipherText || typeof cipherText !== "string") return cipherText;
    try {
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        // If result is empty, decryption failed, return original
        return result || cipherText;
    } catch (e) {
        // If error, return original
        return cipherText;
    }
}
