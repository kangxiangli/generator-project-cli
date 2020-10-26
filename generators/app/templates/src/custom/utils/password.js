import Encrypt from 'jsencrypt'
const RsaCrypt = new Encrypt()
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCY1GyexgDPbf0yyt89l1/b+UC/OhWATlRFrUgcrUCF+QKEK/JSa8vqUZKQ9KAs12Ff6nE38DPOltTBhDxyniyjTXSHysKAOAWyY4xjjXdrWoY4r8CyiyjEj5SlZ1k/5vvytF4aiirMOLCpcRsEReIx7na7KbJdh8HEsA2TUOWdJQIDAQAB'
RsaCrypt.setKey(publicKey)

/**
 * 密码 RSA 加密
 * @param {*} password 原始密码
 */
function rsaCrypt (password) {
  // 设置公钥
  return RsaCrypt.encrypt(password)
}
export {
  rsaCrypt
}
