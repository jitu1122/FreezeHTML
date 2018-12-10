import axios from 'axios';

export default class FreezeHTML {
    constructor({API_URL, API_KEY}) {
        this._URL = API_URL;
        this._KEY = API_KEY;
        this.toImage = this.toImage.bind(this);
        this.exportByHTML = this.exportByHTML.bind(this);
        this.exportById = this.exportById.bind(this);
        this.exportByURL = this.exportByURL.bind(this);
        this.printPDF = this.printPDF.bind(this);
    }
    // Function to convert all canvas to png images.
    toImage(){
        let doc = document.getElementsByTagName('canvas');
        if(doc.length<1){
            return null;
        }
        for (let i=0; i<doc.length; i++) {
            let img = '<img style="width: 100%" src="'+doc[i].toDataURL('image/png',1)+'"/>';
            doc[i].insertAdjacentHTML('afterend', img);
            doc[i].parentNode.removeChild(doc[i]);
        }
        this.toImage();
    }

    exportById(id,cb){
        this.toImage();
        let scroll = document.createElement('style');
        scroll.type = 'text/css';
        if (scroll.styleSheet){
            // This is required for IE8 and below.
            scroll.styleSheet.cssText = 'body,html{overflow:visible !important;}';
        } else {
            scroll.appendChild(document.createTextNode('body,html{overflow:visible !important;}'));
        }
        document.head.appendChild(scroll);
        let head = document.head.outerHTML;
        let body = document.getElementById(id).outerHTML;
        this.printPDF(window.btoa(unescape(encodeURIComponent(head+body))),null,cb);
    }
    exportByHTML(html,cb){
        if(typeof html !== "string") {
            return null
        }
        let encodedHTML = window.btoa(unescape(encodeURIComponent(html)));
        return this.printPDF(encodedHTML,null, cb);
    }
    exportByURL(link,cb){
        return this.printPDF(null,link,cb);
    }

    printPDF(_html,_link,_cb) {
        axios.post(
            this._URL,
            {
                filename : 'test',
                link: _link,
                html: _html,
                landscape: false,
                watermark: true
            },
            {
                timeout: 30000,
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            }).then((response) => {
            _cb(response.data);
        }).catch((error) => {
            _cb(null);
        });
    }

}