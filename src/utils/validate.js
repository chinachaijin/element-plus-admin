
/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
  
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    return (str.trim()).length >= 4
}
  
/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}
  
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}
  
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}
  
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}
  
/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
    // const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
}
  
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
    if (typeof str === 'string' || str instanceof String) {
      return true
    }
    return false
}
  
/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
    if (typeof Array.isArray === 'undefined') {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
}
  
export function isvalidPhone(str) {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    return reg.test(str)
}
  
export const host = process.env.VUE_APP_BASE_HOST
export const api = process.env.VUE_APP_BASE_API
  
/**
 * 方法作用: 生成随机数
 * 创建时间: 2019-05-28
 * 创建人：Cr
 * @param total  要生成的长度 / 几位随机数
 * */
export function generateRandomNumbers(total){
    // 如果不传total或者传0，设置成10位。
    total = total == undefined || total == 0  ? 10 : total;
    let str = '';
    for (let i = 0; i < total; i++) {
        let number = parseInt(Math.random() * 35);
        // 当前生成的随机数大于等于10则进行转换。
        if(number >= 10){
        str += numberConvertEnglishLetters(number);
        }else{
        str += number.toString();
        }
    }
    return str;
}

/**
 * 方法作用: 数字转换成英文字母
 *
 * 创建时间: 2019-05-28
 *
 * 创建人：Cr
 * */
function numberConvertEnglishLetters(number){
    let map = numberConvertEnglishLettersMap();
    for (let i = 0; i < map.length; i++) {
        if(map[i].key == number){
        return map[i].value;
        }
    }
}
  
/**
 * 方法作用: 数字转换成英文字母的映射关系Map
 *
 * 创建时间: 2019-05-28
 *
 * 创建人：Cr
 * */
function numberConvertEnglishLettersMap(){
    return [
        {'key':10,'value':'a'},
        {'key':11,'value':'b'},
        {'key':12,'value':'c'},
        {'key':13,'value':'d'},
        {'key':14,'value':'e'},
        {'key':15,'value':'f'},
        {'key':16,'value':'g'},
        {'key':17,'value':'h'},
        {'key':18,'value':'i'},
        {'key':19,'value':'j'},
        {'key':20,'value':'k'},
        {'key':21,'value':'l'},
        {'key':22,'value':'m'},
        {'key':23,'value':'n'},
        {'key':24,'value':'o'},
        {'key':25,'value':'p'},
        {'key':26,'value':'q'},
        {'key':27,'value':'r'},
        {'key':28,'value':'s'},
        {'key':29,'value':'t'},
        {'key':30,'value':'u'},
        {'key':31,'value':'v'},
        {'key':32,'value':'w'},
        {'key':33,'value':'x'},
        {'key':34,'value':'y'},
        {'key':35,'value':'z'},
    ];
}
  
function getzf(num){  
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
export function utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp+8*60*60;

    // 时间戳转为时间
    // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString('chinese',{hour12:false}).replace(/年|月/g, "-").replace(/日/g, " ");
    var oDate = new Date(parseInt(timestamp) * 1000) 
    var oYear = oDate.getFullYear()
    var oMonth = oDate.getMonth()+1  
    var oDay = oDate.getDate()
    var oHour = oDate.getHours()  
    var oMin = oDate.getMinutes()
    var oSen = oDate.getSeconds()
    var oTime = oYear +'年'+ getzf(oMonth) +'月'+ getzf(oDay) +'日'+ getzf(oHour) +'时'+ getzf(oMin) +'分'+getzf(oSen) + '秒';//最后拼接时间  
    return oTime; // 2017-03-31 16:02:06
}
  
export function toUTCtime(dateStr) {
    //Date(1381243615503+0530),1381243615503,(1381243615503+0800)
    dateStr += "";
    var utcPrefix = 0;
    var offset = 0;
    var dateFormatString = "yyyy-MM-ddThh:mm:ss.SZ";
    var utcTimeString = "";
    var totalMiliseconds = 0;
  
    var regMatchNums = /\d+/gi;
    // var regSign = /[\+|\-]/gi;
    var arrNums = dateStr.match(regMatchNums);
    utcPrefix = parseInt(arrNums[0]);
    if (arrNums.length > 1) {
        offset = arrNums[1];
        var offsetHour = offset.substring(0, 2);
        var offsetMin = offset.substring(2, 4);
        offset = parseInt(offsetHour) * 60 * 60 * 1000 + parseInt(offsetMin) * 60 * 1000;
    }
    if(dateStr.lastIndexOf("+")>-1){
        totalMiliseconds= utcPrefix - offset;
    } else if (dateStr.lastIndexOf("-") > -1) {
        totalMiliseconds = utcPrefix + offset;
    } else {
      totalMiliseconds = utcPrefix
    }
    utcTimeString = dateFtt(dateFormatString, new Date(totalMiliseconds))
    return utcTimeString;
}
  
/**************************************时间格式化处理************************************/
function dateFtt(fmt,date) 
{ //author: meizz 
    var o = { 
    "M+" : date.getMonth()+1, //月份 
    "d+" : date.getDate(), //日 
    "h+" : date.getHours(), //小时 
    "m+" : date.getMinutes(), //分 
    "s+" : date.getSeconds(), //秒 
    "q+" : Math.floor((date.getMonth()+3)/3), //季度 
    "S" : date.getMilliseconds() //毫秒 
    }; 
    if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
    return fmt; 
}