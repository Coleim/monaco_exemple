import { Component, ViewChild, ElementRef } from '@angular/core';

import { CompletionItemProvider } from "monaco-editor/monaco";

declare const monaco: any;
declare const require: any;

@Component({
    selector: "my-app",
    template: `<div id='editor' #editor class="monaco-editor" style="height: 600px;"></div>`
})
export class AppComponent {
    @ViewChild('editor') editorContent: ElementRef;
      
    constructor() {}
    ngAfterViewInit() {
        var onGotAmdLoader = () => {
            // Load monaco
            (<any>window).require(['vs/editor/editor.main'], () => {
                this.initMonaco();
            });
        };

        // Load AMD loader if necessary
        if (!(<any>window).require) {
            var loaderScript = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = 'vs/loader.js';
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }
    }

    // Will be called once monaco library is available
    initMonaco() {
        var myDiv: HTMLDivElement = this.editorContent.nativeElement;
        monaco.languages.setMonarchTokensProvider('custom', {
            tokenizer: {
                root: [
                    [/\[error.*/, "custom-error"],
                    [/\[notice.*/, "custom-notice"],
                    [/\[info.*/, "custom-info"],
                    [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
                ]
            }
        });

        
        monaco.languages.register({ id: 'custom' });
        //monaco.languages.registerCompletionItemProvider('custom', new CustomCompletionItemProvider());
        var editor = monaco.editor.create(myDiv, {
            value: "Hello World",
            language: 'custom',
        });
    }
}
