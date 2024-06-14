import RenderState from "../RenderState.ts";
import {unescape} from "../helper.ts";
import Prism, {TokenStream} from "prismjs";
import {defaultLineHeight, leftMargin, topMargin} from "../Consts.ts";
import {getMinimumFontSize, splitTextAtMaxLen} from "../RendererHelper.ts";

interface InnerRenderState {
    x: number;
    lineHeight: number;
    readonly leftPadding: number;
    readonly rightPadding: number;
}

export default function renderCode(code: string, infostring: string | undefined, escaped: boolean, renderState: RenderState): void {
    const prevFont = renderState.doc.getFont();
    const prevFontSize = renderState.doc.getFontSize();

    renderState.doc.setFont('D2Coding', 'normal');
    renderState.doc.setFontSize(10);

    const lang = (infostring || '').match(/^\S*/)?.[0];

    const unescapedCode = escaped ? unescape(code) : code;
    const prismLang: Prism.Grammar | undefined = (lang) ? Prism.languages[lang] : undefined;
    const prismTokens = prismLang ? Prism.tokenize(
        unescapedCode.replace(/\n$/, '') + '\n', prismLang) : [unescapedCode];
    const virtualRenderState: VirtualRenderState = {
        rects: [],
        lastRect: {startY: renderState.y, endY: renderState.y}
    };
    const innerRenderState: InnerRenderState = {
        x: 0,
        lineHeight: renderState.doc.getFontSize() * defaultLineHeight,
        leftPadding: 5,
        rightPadding: 5
    };
    virtualRenderCode(prismTokens, renderState, innerRenderState, virtualRenderState)
    const rects = virtualRenderState.rects;
    rects.push({...virtualRenderState.lastRect});

    console.log(virtualRenderState.lastRect);
    const firstRect = rects.shift()!;
    const totalTextWidth = renderState.pageWidth - innerRenderState.leftPadding - innerRenderState.rightPadding;
    renderState.doc.setFillColor('#272822');
    renderState.doc.rect(
        leftMargin,
        firstRect.startY - renderState.doc.getFontSize(),
        totalTextWidth + innerRenderState.leftPadding + innerRenderState.rightPadding,
        firstRect.endY - firstRect.startY, 'F');

    _renderCode(prismTokens, renderState, {
        x: 0,
        lineHeight: renderState.doc.getFontSize() * defaultLineHeight,
        leftPadding: 5,
        rightPadding: 5
    }, rects)

    renderState.y += 10;
    renderState.doc.setFont(prevFont.fontName, prevFont.fontStyle);
    renderState.doc.setFontSize(prevFontSize);
}

// todo: apply style https://prismjs.com/themes/prism-okaidia.css
function _renderTextInner(tokenText: string, renderState: RenderState, innerRenderState: InnerRenderState, rects: VirtualRect[], type?: string): void {
    const prevTextColor = renderState.doc.getTextColor();
    const prevFont = renderState.doc.getFont();

    if (type) {
        switch (type) {
            case "comment":
            case "prolog":
            case "doctype":
            case "cdata": {
                renderState.doc.setTextColor("#8292a2");
                break;
            }
            case "punctuation":
                renderState.doc.setTextColor("#f8f8f2");
                break;
            case "namespace":
                renderState.doc.setTextColor("#b9bab4");
                break;
            case "property":
            case "tag":
            case "constant":
            case "symbol":
            case "deleted": {
                renderState.doc.setTextColor("#f92672");
                break;
            }
            case "boolean":
            case "number": {
                renderState.doc.setTextColor("#ae81ff");
                break;
            }
            case "selector":
            case "attr-name":
            case "string":
            case "char":
            case "builtin":
            case "inserted": {
                renderState.doc.setTextColor("#a6e22e");
                break;
            }
            case "operator":
            case "entity":
            case "url":
            case "variable": {
                renderState.doc.setTextColor("#f8f8f2");
                break;
            }

            case "atrule":
            case "attr-value":
            case "function":
            case "class-name": {
                renderState.doc.setTextColor("#e6db74");
                break;
            }
            case "keyword":
                renderState.doc.setTextColor("#66d9ef");
                break;
            case "regex":
            case "important": {
                renderState.doc.setTextColor("#fd971f");
                break;
            }
            default:
                renderState.doc.setTextColor('#f8f8f2');
                break;
        }

        switch (type) {
            case "bold":
            case "important": {
                renderState.doc.setFont('D2Coding', 'bold');
                break;
            }
            case "italic":
                // todo: find out
                break;
        }
    } else {
        renderState.doc.setTextColor('#f8f8f2');
    }

    const totalTextWidth = renderState.pageWidth - innerRenderState.leftPadding - innerRenderState.rightPadding;
    while (tokenText.length > 0) {
        const [toPrint, rest, forceNewLine] = splitTextAtMaxLen(tokenText, totalTextWidth - innerRenderState.x, renderState.doc);
        if (toPrint != '') {
            if (renderState.y + innerRenderState.lineHeight > renderState.pageHeight) {
                renderState.doc.addPage();
                renderState.y = topMargin;

                const virtualRect = rects.shift()!;
                renderState.doc.setFillColor('#272822');
                renderState.doc.rect(
                    leftMargin,
                    virtualRect.startY - renderState.doc.getFontSize(),
                    totalTextWidth + innerRenderState.leftPadding + innerRenderState.rightPadding,
                    virtualRect.endY - virtualRect.startY, 'F');
            }
            const textWidth = renderState.doc.getTextWidth(toPrint);
            renderState.doc.text(toPrint, innerRenderState.x + leftMargin + innerRenderState.leftPadding, renderState.y);
            innerRenderState.x = innerRenderState.x + textWidth;
        }
        tokenText = rest;

        let insufficientSpace = forceNewLine;
        if (!insufficientSpace) {
            insufficientSpace = (innerRenderState.x + getMinimumFontSize(renderState.doc) > totalTextWidth);
        }
        if (!insufficientSpace) {
            insufficientSpace = (toPrint == '' && rest != '');
        }
        if (insufficientSpace) {
            renderState.y += innerRenderState.lineHeight;
            innerRenderState.x = 0;
        }
    }

    renderState.doc.setTextColor(prevTextColor);
    renderState.doc.setFont(prevFont.fontName, prevFont.fontStyle);
}

interface VirtualRenderState {
    rects: VirtualRect[]
    lastRect: VirtualRect
}

interface VirtualRect {
    startY: number;
    endY: number;
}

function virtualRenderCode(token: TokenStream, renderState: RenderState, innerRenderState: InnerRenderState, virtualRenderState: VirtualRenderState): void {
    if (typeof token == 'string') {
        virtualRenderTextInner(token, renderState, innerRenderState, virtualRenderState);
        return;
    }
    if (Array.isArray(token)) {
        token.forEach(function (e) {
            virtualRenderCode(e, renderState, innerRenderState, virtualRenderState);
        });
        return;
    }

    const tokenObj = token as Prism.Token
    virtualRenderCode(tokenObj.content, renderState, innerRenderState, virtualRenderState);
}

function virtualRenderTextInner(tokenText: string, renderState: RenderState, innerRenderState: InnerRenderState, virtualRenderState: VirtualRenderState): void {
    const totalTextWidth = renderState.pageWidth - innerRenderState.leftPadding - innerRenderState.rightPadding;
    while (tokenText.length > 0) {
        const [toPrint, rest, forceNewLine] = splitTextAtMaxLen(tokenText, totalTextWidth - innerRenderState.x, renderState.doc);
        if (toPrint != '') {
            if (virtualRenderState.lastRect.endY + innerRenderState.lineHeight > renderState.pageHeight) {
                virtualRenderState.rects.push({...virtualRenderState.lastRect});
                virtualRenderState.lastRect.startY = topMargin;
                virtualRenderState.lastRect.endY = topMargin;
            }
            const textWidth = renderState.doc.getTextWidth(toPrint);
            // renderState.doc.text(toPrint, innerRenderState.x + leftMargin + innerRenderState.leftPadding, renderState.y);
            innerRenderState.x = innerRenderState.x + textWidth;
        }
        tokenText = rest;

        let insufficientSpace = forceNewLine;
        if (!insufficientSpace) {
            insufficientSpace = (innerRenderState.x + getMinimumFontSize(renderState.doc) > totalTextWidth);
        }
        if (!insufficientSpace) {
            insufficientSpace = (toPrint == '' && rest != '');
        }
        if (insufficientSpace) {
            virtualRenderState.lastRect.endY += innerRenderState.lineHeight;
            innerRenderState.x = 0;
        }
    }
}

function _renderCode(token: TokenStream, renderState: RenderState, innerRenderState: InnerRenderState, rects: VirtualRect[], type?: string): void {
    if (typeof token == 'string') {
        _renderTextInner(token, renderState, innerRenderState, rects, type);
        return;
    }
    if (Array.isArray(token)) {
        token.forEach(function (e) {
            _renderCode(e, renderState, innerRenderState, rects, type);
        });
        return;
    }

    const tokenObj = token as Prism.Token
    _renderCode(tokenObj.content, renderState, innerRenderState, rects, tokenObj.type);
}

