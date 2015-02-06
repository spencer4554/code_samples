module.exports.asFormatedString = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports.asCurrency = function(num) {
    if (isNaN(num) || !num && num !== 0) {
        return '--';
    }

    var neg = (num < 0);
    if (neg) {
        num = num * -1;
    }
    var str = module.exports.asFormatedString(num.toFixed(2));
    str = "$" + str;
    if (neg) {
        str = "(" + str + ")";
    }
    return str;
};  
