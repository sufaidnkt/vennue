exports.getConstants = function(){
    return {
        port : '2019',
        ENV: 'DEVELOPMENT',//PRODUCTION 
    };
};

exports.getbackofficeDetails = function () {
    return {
        host: 'http://main.sypce.nsb',
        csv_tran_path : '/afl/api/csv-extra-transaction',
        api_key: '2xEfeLwBFwdSDMUrnSQXDWwlEfQ5hxhL',
        api_name: 'mlm',
        login_api: '/afl/api/app-login-validation',
    };
};

