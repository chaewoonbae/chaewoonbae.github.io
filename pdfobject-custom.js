(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.PDFObject = factory();
    }
}(this, function () {

    "use strict";

    let pdfobjectversion = "3.0.0-custom";

    // DOM 도우미 함수
    let emptyNodeContents = function (node){
        while(node.firstChild){
            node.removeChild(node.firstChild);
        }
    };

    let getTargetElement = function (targetSelector){
        let targetNode = document.body;
        if(typeof targetSelector === "string"){
            targetNode = document.querySelector(targetSelector);
        } else if (targetSelector && targetSelector.nodeType === 1){
            targetNode = targetSelector;
        }
        return targetNode;
    };

    // PDF.js 기반 임베딩
    let generatePDFJSMarkup = function (targetNode, url, pdfOpenFragment, PDFJS_URL, id, omitInlineStyles){
        emptyNodeContents(targetNode);

        let fullURL = PDFJS_URL + "?file=" + encodeURIComponent(url) + pdfOpenFragment;
        let div = document.createElement("div");
        let iframe = document.createElement("iframe");

        iframe.src = fullURL;
        iframe.className = "pdfobject";
        iframe.type = "application/pdf";
        iframe.frameBorder = "0";

        if(id){
            iframe.id = id;
        }

        if(!omitInlineStyles){
            div.style.cssText = "position: absolute; top: 0; right: 0; bottom: 0; left: 0;";
            iframe.style.cssText = "border: none; width: 100%; height: 100%;";
            targetNode.style.position = "relative";
            targetNode.style.overflow = "auto";        
        }

        div.appendChild(iframe);
        targetNode.appendChild(div);
        targetNode.classList.add("pdfobject-container");

        return iframe;
    };

    // 메인 API
    let embed = function(url, targetSelector, options){
        let selector = targetSelector || false;
        let opt = options || {};

        let id = (typeof opt.id === "string") ? opt.id : "";
        let page = opt.page || false;
        let pdfOpenParams = opt.pdfOpenParams || {};
        let omitInlineStyles = (typeof opt.omitInlineStyles === "boolean") ? opt.omitInlineStyles : false;
        let PDFJS_URL = opt.PDFJS_URL || "/pdfjs/web/viewer.html"; // 기본 경로

        let targetNode = getTargetElement(selector);
        let pdfOpenFragment = "";

        if(page){ pdfOpenParams.page = page; }

        // PDF Open Params를 해시로 변환
        if(pdfOpenParams){
            let string = "";
            for (let prop in pdfOpenParams) {
                if (pdfOpenParams.hasOwnProperty(prop)) {
                    string += encodeURIComponent(prop) + "=" + encodeURIComponent(pdfOpenParams[prop]) + "&";
                }
            }
            if(string){
                pdfOpenFragment = "#" + string.slice(0, -1);
            }
        }

        // 항상 PDF.js 뷰어로 임베딩
        return generatePDFJSMarkup(targetNode, url, pdfOpenFragment, PDFJS_URL, id, omitInlineStyles);
    };

    return {
        embed: function (a,b,c){ return embed(a,b,c); },
        pdfobjectversion: (function () { return pdfobjectversion; })()
    };

}));
