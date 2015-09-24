function utf8_encode(argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman
    // bugfixed by: Onno Marsman
    // bugfixed by: Ulrich
    // bugfixed by: Rafal Kukawski
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

function sha1(str) {
    //  discuss at: http://phpjs.org/functions/sha1/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Brett Zamir (http://brett-zamir.me)
    //  depends on: utf8_encode
    //   example 1: sha1('Kevin van Zonneveld');
    //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

    var rotate_left = function(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    /*var lsb_hex = function (val) { // Not in use; needed?
     var str="";
     var i;
     var vh;
     var vl;

     for ( i=0; i<=6; i+=2 ) {
     vh = (val>>>(i*4+4))&0x0f;
     vl = (val>>>(i*4))&0x0f;
     str += vh.toString(16) + vl.toString(16);
     }
     return str;
     };*/

    var cvt_hex = function(val) {
        var str = '';
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    str = this.utf8_encode(str);
    var str_len = str.length;

    var word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (str_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
            8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) {
        word_array.push(0);
    }

    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) {
            W[i] = word_array[blockstart + i];
        }
        for (i = 16; i <= 79; i++) {
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
}

function file_get_contents(url, flags, context, offset, maxLen) {
    //  discuss at: http://phpjs.org/functions/file_get_contents/
    // original by: Legaev Andrey
    //    input by: Jani Hartikainen
    //    input by: Raphael (Ao) RUDLER
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //        note: This function uses XmlHttpRequest and cannot retrieve resource from different domain without modifications.
    //        note: Synchronous by default (as in PHP) so may lock up browser. Can
    //        note: get async by setting a custom "phpjs.async" property to true and "notification" for an
    //        note: optional callback (both as context params, with responseText, and other JS-specific
    //        note: request properties available via 'this'). Note that file_get_contents() will not return the text
    //        note: in such a case (use this.responseText within the callback). Or, consider using
    //        note: jQuery's: $('#divId').load('http://url') instead.
    //        note: The context argument is only implemented for http, and only partially (see below for
    //        note: "Presently unimplemented HTTP context options"); also the arguments passed to
    //        note: notification are incomplete
    //        test: skip
    //   example 1: var buf file_get_contents('http://google.com');
    //   example 1: buf.indexOf('Google') !== -1
    //   returns 1: true

    var tmp, headers = [],
        newTmp = [],
        k = 0,
        i = 0,
        href = '',
        pathPos = -1,
        flagNames = 0,
        content = null,
        http_stream = false;
    var func = function(value) {
        return value.substring(1) !== '';
    };

    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    // END REDUNDANT
    var ini = this.php_js.ini;
    context = context || this.php_js.default_streams_context || null;

    if (!flags) {
        flags = 0;
    }
    var OPTS = {
        FILE_USE_INCLUDE_PATH: 1,
        FILE_TEXT: 32,
        FILE_BINARY: 64
    };
    if (typeof flags === 'number') { // Allow for a single string or an array of string flags
        flagNames = flags;
    } else {
        flags = [].concat(flags);
        for (i = 0; i < flags.length; i++) {
            if (OPTS[flags[i]]) {
                flagNames = flagNames | OPTS[flags[i]];
            }
        }
    }

    if (flagNames & OPTS.FILE_BINARY && (flagNames & OPTS.FILE_TEXT)) { // These flags shouldn't be together
        throw 'You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()';
    }

    if ((flagNames & OPTS.FILE_USE_INCLUDE_PATH) && ini.include_path && ini.include_path.local_value) {
        var slash = ini.include_path.local_value.indexOf('/') !== -1 ? '/' : '\\';
        url = ini.include_path.local_value + slash + url;
    } else if (!/^(https?|file):/.test(url)) { // Allow references within or below the same directory (should fix to allow other relative references or root reference; could make dependent on parse_url())
        href = this.window.location.href;
        pathPos = url.indexOf('/') === 0 ? href.indexOf('/', 8) - 1 : href.lastIndexOf('/');
        url = href.slice(0, pathPos + 1) + url;
    }

    var http_options;
    if (context) {
        http_options = context.stream_options && context.stream_options.http;
        http_stream = !! http_options;
    }

    if (!context || http_stream) {
        var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
        if (!req) {
            throw new Error('XMLHttpRequest not supported');
        }

        var method = http_stream ? http_options.method : 'GET';
        var async = !! (context && context.stream_params && context.stream_params['phpjs.async']);

        if (ini['phpjs.ajaxBypassCache'] && ini['phpjs.ajaxBypassCache'].local_value) {
            url += (url.match(/\?/) == null ? '?' : '&') + (new Date())
                .getTime(); // Give optional means of forcing bypass of cache
        }

        req.open(method, url, async);
        if (async) {
            var notification = context.stream_params.notification;
            if (typeof notification === 'function') {
                // Fix: make work with req.addEventListener if available: https://developer.mozilla.org/En/Using_XMLHttpRequest
                if (0 && req.addEventListener) { // Unimplemented so don't allow to get here
                    /*
                     req.addEventListener('progress', updateProgress, false);
                     req.addEventListener('load', transferComplete, false);
                     req.addEventListener('error', transferFailed, false);
                     req.addEventListener('abort', transferCanceled, false);
                     */
                } else {
                    req.onreadystatechange = function(aEvt) { // aEvt has stopPropagation(), preventDefault(); see https://developer.mozilla.org/en/NsIDOMEvent
                        // Other XMLHttpRequest properties: multipart, responseXML, status, statusText, upload, withCredentials
                        /*
                         PHP Constants:
                         STREAM_NOTIFY_RESOLVE   1       A remote address required for this stream has been resolved, or the resolution failed. See severity  for an indication of which happened.
                         STREAM_NOTIFY_CONNECT   2     A connection with an external resource has been established.
                         STREAM_NOTIFY_AUTH_REQUIRED 3     Additional authorization is required to access the specified resource. Typical issued with severity level of STREAM_NOTIFY_SEVERITY_ERR.
                         STREAM_NOTIFY_MIME_TYPE_IS  4     The mime-type of resource has been identified, refer to message for a description of the discovered type.
                         STREAM_NOTIFY_FILE_SIZE_IS  5     The size of the resource has been discovered.
                         STREAM_NOTIFY_REDIRECTED    6     The external resource has redirected the stream to an alternate location. Refer to message .
                         STREAM_NOTIFY_PROGRESS  7     Indicates current progress of the stream transfer in bytes_transferred and possibly bytes_max as well.
                         STREAM_NOTIFY_COMPLETED 8     There is no more data available on the stream.
                         STREAM_NOTIFY_FAILURE   9     A generic error occurred on the stream, consult message and message_code for details.
                         STREAM_NOTIFY_AUTH_RESULT   10     Authorization has been completed (with or without success).

                         STREAM_NOTIFY_SEVERITY_INFO 0     Normal, non-error related, notification.
                         STREAM_NOTIFY_SEVERITY_WARN 1     Non critical error condition. Processing may continue.
                         STREAM_NOTIFY_SEVERITY_ERR  2     A critical error occurred. Processing cannot continue.
                         */
                        var objContext = {
                            responseText: req.responseText,
                            responseXML: req.responseXML,
                            status: req.status,
                            statusText: req.statusText,
                            readyState: req.readyState,
                            evt: aEvt
                        }; // properties are not available in PHP, but offered on notification via 'this' for convenience
                        // notification args: notification_code, severity, message, message_code, bytes_transferred, bytes_max (all int's except string 'message')
                        // Need to add message, etc.
                        var bytes_transferred;
                        switch (req.readyState) {
                            case 0:
                                //     UNINITIALIZED     open() has not been called yet.
                                notification.call(objContext, 0, 0, '', 0, 0, 0);
                                break;
                            case 1:
                                //     LOADING     send() has not been called yet.
                                notification.call(objContext, 0, 0, '', 0, 0, 0);
                                break;
                            case 2:
                                //     LOADED     send() has been called, and headers and status are available.
                                notification.call(objContext, 0, 0, '', 0, 0, 0);
                                break;
                            case 3:
                                //     INTERACTIVE     Downloading; responseText holds partial data.
                                bytes_transferred = req.responseText.length * 2; // One character is two bytes
                                notification.call(objContext, 7, 0, '', 0, bytes_transferred, 0);
                                break;
                            case 4:
                                //     COMPLETED     The operation is complete.
                                if (req.status >= 200 && req.status < 400) {
                                    bytes_transferred = req.responseText.length * 2; // One character is two bytes
                                    notification.call(objContext, 8, 0, '', req.status, bytes_transferred, 0);
                                } else if (req.status === 403) { // Fix: These two are finished except for message
                                    notification.call(objContext, 10, 2, '', req.status, 0, 0);
                                } else { // Errors
                                    notification.call(objContext, 9, 2, '', req.status, 0, 0);
                                }
                                break;
                            default:
                                throw 'Unrecognized ready state for file_get_contents()';
                        }
                    };
                }
            }
        }

        if (http_stream) {
            var sendHeaders = http_options.header && http_options.header.split(/\r?\n/);
            var userAgentSent = false;
            for (i = 0; i < sendHeaders.length; i++) {
                var sendHeader = sendHeaders[i];
                var breakPos = sendHeader.search(/:\s*/);
                var sendHeaderName = sendHeader.substring(0, breakPos);
                req.setRequestHeader(sendHeaderName, sendHeader.substring(breakPos + 1));
                if (sendHeaderName === 'User-Agent') {
                    userAgentSent = true;
                }
            }
            if (!userAgentSent) {
                var user_agent = http_options.user_agent || (ini.user_agent && ini.user_agent.local_value);
                if (user_agent) {
                    req.setRequestHeader('User-Agent', user_agent);
                }
            }
            content = http_options.content || null;
            /*
             // Presently unimplemented HTTP context options
             var request_fulluri = http_options.request_fulluri || false; // When set to TRUE, the entire URI will be used when constructing the request. (i.e. GET http://www.example.com/path/to/file.html HTTP/1.0). While this is a non-standard request format, some proxy servers require it.
             var max_redirects = http_options.max_redirects || 20; // The max number of redirects to follow. Value 1 or less means that no redirects are followed.
             var protocol_version = http_options.protocol_version || 1.0; // HTTP protocol version
             var timeout = http_options.timeout || (ini.default_socket_timeout && ini.default_socket_timeout.local_value); // Read timeout in seconds, specified by a float
             var ignore_errors = http_options.ignore_errors || false; // Fetch the content even on failure status codes.
             */
        }

        if (flagNames & OPTS.FILE_TEXT) { // Overrides how encoding is treated (regardless of what is returned from the server)
            var content_type = 'text/html';
            if (http_options && http_options['phpjs.override']) { // Fix: Could allow for non-HTTP as well
                content_type = http_options['phpjs.override']; // We use this, e.g., in gettext-related functions if character set
                //   overridden earlier by bind_textdomain_codeset()
            } else {
                var encoding = (ini['unicode.stream_encoding'] && ini['unicode.stream_encoding'].local_value) ||
                    'UTF-8';
                if (http_options && http_options.header && (/^content-type:/im)
                        .test(http_options.header)) { // We'll assume a content-type expects its own specified encoding if present
                    content_type = http_options.header.match(/^content-type:\s*(.*)$/im)[1]; // We let any header encoding stand
                }
                if (!(/;\s*charset=/)
                        .test(content_type)) { // If no encoding
                    content_type += '; charset=' + encoding;
                }
            }
            req.overrideMimeType(content_type);
        }
        // Default is FILE_BINARY, but for binary, we apparently deviate from PHP in requiring the flag, since many if not
        //     most people will also want a way to have it be auto-converted into native JavaScript text instead
        else if (flagNames & OPTS.FILE_BINARY) { // Trick at https://developer.mozilla.org/En/Using_XMLHttpRequest to get binary
            req.overrideMimeType('text/plain; charset=x-user-defined');
            // Getting an individual byte then requires:
            // responseText.charCodeAt(x) & 0xFF; // throw away high-order byte (f7) where x is 0 to responseText.length-1 (see notes in our substr())
        }

        try {
            if (http_options && http_options['phpjs.sendAsBinary']) { // For content sent in a POST or PUT request (use with file_put_contents()?)
                req.sendAsBinary(content); // In Firefox, only available FF3+
            } else {
                req.send(content);
            }
        } catch (e) {
            // catches exception reported in issue #66
            return false;
        }

        tmp = req.getAllResponseHeaders();
        if (tmp) {
            tmp = tmp.split('\n');
            for (k = 0; k < tmp.length; k++) {
                if (func(tmp[k])) {
                    newTmp.push(tmp[k]);
                }
            }
            tmp = newTmp;
            for (i = 0; i < tmp.length; i++) {
                headers[i] = tmp[i];
            }
            this.$http_response_header = headers; // see http://php.net/manual/en/reserved.variables.httpresponseheader.php
        }

        if (offset || maxLen) {
            if (maxLen) {
                return req.responseText.substr(offset || 0, maxLen);
            }
            return req.responseText.substr(offset);
        }
        return req.responseText;
    }
    return false;
}

function sha1_file(str_filename) {
    //  discuss at: http://phpjs.org/functions/sha1_file/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  depends on: file_get_contents
    //  depends on: sha1
    //        test: skip
    //   example 1: sha1_file('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');
    //   returns 1: '40bd001563085fc35165329ea1ff5c5ecbdbbeef'

    var buf = this.file_get_contents(str_filename);

    return this.sha1(buf);
}