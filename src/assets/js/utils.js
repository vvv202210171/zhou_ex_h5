// import CryptoJS from 'crypto-js';
// const key = CryptoJS.enc.Utf8.parse("1234567890abcdef");
// const iv  = CryptoJS.enc.Utf8.parse('1234567890abcdef');
import ClipboardJS from 'clipboard'
import { Toast } from 'vant'
import i18n from '@/i18n'
const utils = {
  // AES 加密
  // encode(data){
  //   let msg = CryptoJS.enc.Utf8.parse(data);
  //   let encrypted = CryptoJS.AES.encrypt(msg, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
  //   return encrypted.ciphertext.toString().toUpperCase();
  // },

  // //AES解密
  // decode(data){
  //   let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  //   let msg = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  //   let decrypt = CryptoJS.AES.decrypt(msg, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
  //   let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  //   return decryptedStr.toString();
  // },

  compareRise(property, type) {
    return function(a, b) {
      var value1 = a[property]
      var value2 = b[property]
      if (type == 'up') { // 升序
        return value1 - value2
      } else { // 降序
        return value2 - value1
      }
    }
  },
  // 数组排序  arr.sort(this.compare("property","up"))
  compare(property, type) {
    return function(a, b) {
      var value1 = a[property]
      var value2 = b[property]
      if (type == 'up') { // 升序
        return value1 < value2
      } else { // 降序
        return value1 > value2
      }
    }
  },

  isUserName(data) {
    if (data == '') return false
    const pattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/ // 6-12字母加数字组合  必须是英文字母开头
    return pattern.test(data)
  },
  isPhone: (data) => {
    //const pattern = /^(1[3456789])\d{9}$/
    const pattern = /^\d{6,15}$/
    if (data == '') return false
    return pattern.test(data)
  },
  isEmail(data) {
    const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (data == '') return false
    return pattern.test(data)
  },

  isPhoneOrEmail(data) {
    if (!data) {
      return false
    } else if (utils.isPhone(data)) {
      return true
    } else if (utils.isEmail(data)) {
      return true
    } else {
      return false
    }
  },
  isPassword: (data) => {
    const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if (data == '') return false
    return pattern.test(data)
  },
  // isPassword: (data) => {
  //   let pattern = /^(\w){6,20}$/;
  //   if (data == "") return false;
  //   return pattern.test(data);
  // },
  isPayPass: (data) => {
    const pattern = /^[0-9]{6}$/
    if (data == '') return false
    return pattern.test(data)
  },
  isIdCard: function(data) {
    var str = data
    if (str == '') return false
    var len = str.length
    if (len == 15) {
      var reg = /^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/
    } else if (len == 18) {
      var reg = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d|X|x)$/
    } else {
      return false
    }

    if (!reg.test(str)) return false

    var part = str.match(reg)
    var year = (len == 15) ? ('19' + part[3]) : part[3]
    var date = new Date(year + '/' + part[4] + '/' + part[5])
    if ((date.getFullYear() != year) ||
      ((date.getMonth() + 1) != (part[4] | 0)) ||
      (date.getDate() != (part[5] | 0))) { return false }

    if (len == 15) return true
    var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var lastcode = '10X98765432'
    var sum = 0
    for (var i = 0; i < 17; i++) {
      sum += parseInt(str.charAt(i)) * wi[i]
    }
    return (lastcode.charAt(sum % 11) == part[7].toUpperCase())
  },
  getCardAge(cardNum) {
    // 获取年龄
    const myDate = new Date()
    var month = myDate.getMonth() + 1
    var day = myDate.getDate()
    var age = myDate.getFullYear() - cardNum.substring(6, 10) - 1
    if (cardNum.substring(10, 12) < month || (cardNum.substring(10, 12) == month && cardNum.substring(12, 14) <= day)) {
      age++
    }
    return age
  },
  isBankNo(data) {
    return /^\d{16,19}$/.test(data)
  },
  isPositiveNum(data) {
    return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d{0,8})$/.test(data)
  },
  isCorrectFigure(data) {
    return (data) && (!isNaN(data)) && (data > 0)
  },
  isInt(data) {
    return /^[+]{0,1}(\d+)$/.test(data)
  },
  isPrice(data) {
    return /^(?!^0*(\.0{1,3})?$)^\d{1,13}(\.\d{1,6})?$/.test(data)
  },

  dateFormat(newDate) {
    if (!newDate) { return }
    const year = newDate.getFullYear()
    const mouth = newDate.getMonth() >= 9 ? newDate.getMonth() + 1 : `0${newDate.getMonth() + 1}`
    const date = newDate.getDate() > 9 ? newDate.getDate() : `0${newDate.getDate()}`
    const hours = newDate.getHours() > 9 ? newDate.getHours() : `0${newDate.getHours()}`
    const min = newDate.getMinutes() > 9 ? newDate.getMinutes() : `0${newDate.getMinutes()}`
    const sec = newDate.getSeconds() > 9 ? newDate.getSeconds() : `0${newDate.getSeconds()}`

    return `${year}-${mouth}-${date} ${hours}:${min}:${sec}`
  },

  promote() {
    const clipboard = new ClipboardJS('.copy_btn', {
      text: function(trigger) {
        return trigger.getAttribute('aria-label')
      }
    })
    clipboard.on('success', (e) => {
      e.clearSelection()
      Toast(i18n.t('commonLang.lang7'))
      clipboard.destroy()
    })
    clipboard.on('error', (e) => {
      if (ClipboardJS.isSupported()) {
        Toast(i18n.t('commonLang.lang7'))
        clipboard.destroy()
        return
      }
      Toast(i18n.t('commonLang.lang8'))
      clipboard.destroy()
    })
  },

  dateTransfer(str) {
    if (str) {
      const date = str.replace(/-/g, '/')
      return new Date(date).getTime()
    }
  }
}
export default utils
