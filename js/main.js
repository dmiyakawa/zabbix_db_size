/*!
 * Estimates Zabbix DB size
 */

var url = 'http://localhost/zabbix/api_jsonrpc.php';

var options = {};
options.url = url;
var server = null;

$(document).ready(function(){
    server = new $.jqzabbix(options);
});

function checkVersion(form) {
    options.url = form.url.value;
    server.setOptions(options);
    server.getApiVersion(null, function(response){
    $('#result').html('<ul><li>Zabbix API Url: '
                      + options.url +'</li>'
                      + '<li>API Version: '
                      + response.result + '</li></ul>');
    });
}

function doExecute(form){
    options.url = form.url.value;
    options.username = form.username.value;
    options.password = form.password.value;
    console.log("url: " + options.url
                + ", username: " + options.username);
    server.setOptions(options);
    server.userLogin(null, loginSuccessMethod, errorMethod);
}

function loginSuccessMethod() {
    console.log("loginSuccessMethod()");
    $('#result').empty();
    server.sendAjaxRequest('item.get', {'output': 'extend',
                                        'templated': false},
                           onItemObtained, errorMethod);
};

function onItemObtained(response, status) {
    var total = 0;
    var items = response.result.length;
    $.each(response.result, function() {
        // Update interval (in sec)
        var interval = parseInt(this['delay']);
        // History storage period (in days)
        var history = parseInt(this['history']);
        var trends = parseInt(this['trends']);
        // 50 bytes per history, 128 bytes per trend
        var estimated = ((50 * history * (24 * 3600) / interval)
                         + (128 * trends * 24));
        total += estimated;
    });

    var totalStr = '?';
    if (total > 1024 * 1024 * 1024) {
        totalStr = (total / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    } else if (total > 1024 * 1024) {
        totalStr = (total / (1024 * 1024)).toFixed(2) + " MB";
    } else if (total > 1024) {
        totalStr = (total / 1024).toFixed(2) + " KB";
    }
    $('#result').html('<ul><li>' + items + ' items found</li>'
                     + '<li>total: ' + totalStr + ' (per year)</li>'
                     + '<li>(Note: Events will increase data size too)</li>'
                     + '</ul>');
}


function changeMethod2(value) {

    var method1 = value;

    var methodlist = '';
    $.each(methods[method1], function(key) {
        methodlist += '<option value="' + key + '">' + key + '</option>';
    });

    $('.method2').html(methodlist);
    changeParameters(method1, $('#request select.method2').val());
}

function changeParameters(method1, method2) {

    if (methods[method1][method2].length === 0) {
        $('.parameters').html('Paraneters are not exists or not configured.');
    }
    else {

        var parameterlist = '';

        $.each(methods[method1][method2], function(key, value) {
            parameterlist += '<tr><td>' + value
                       + '</td><td><input type="text" name="'
                       + value + '"/></td></tr>';
        });

        $('.parameters').html('<table>' + parameterlist + '</table>');
    }
}

function doRequest(form) {

    // method
    var method = form.method1.value + '.' +form.method2.value;

    // parameter
    var params = {};

    $('#request .parameters input').each(function(){
        if (this.value){
            params[this.name] = this.value;
        }
    });

    server.sendAjaxRequest(method, params, successMethod, errorMethod);
}

function toggleParameters() {
    $('.parameters').slideToggle();
}

var errorMethod = function(msg) {
    console.log('errorMethod()');
    var errormsg = '';

    $.each(server.isError(), function(key, value) {
        errormsg += '<li>' + key + ' : ' + value + '</li>';
    });

    $('#result').html('<ul>' + errormsg + '</ul>');
};

