import {Token, Tokens} from "marked";
import jsPDF from "jspdf";
import {unescape} from "./helper.ts";
import Prism, {TokenStream} from 'prismjs';

// converting mm to pt : 1mm = 2.83464 pt
const topMargin = 30 * 2.83465;
const bottomMargin = 30 * 2.83465;
const leftMargin = 25 * 2.83465;
const rightMargin = 25 * 2.83465;

const hFontSize = [32, 24, 18.72, 16, 13.28, 10.72];

interface RenderState {
    readonly doc: jsPDF;
    readonly pageWidth: number;
    readonly pageHeight: number;
    y: number;
}

interface InnerRenderState {
    x: number;
    lineHeight: number;
    readonly leftPadding: number;
    readonly rightPadding: number;
}

function getRenderState(doc: jsPDF): RenderState {
    function pageWidth(doc: jsPDF) {
        return doc.internal.pageSize.width - (leftMargin + rightMargin)
    }


    function pageHeight(doc: jsPDF) {
        return doc.internal.pageSize.height - bottomMargin;
    }

    return {
        doc,
        pageWidth: pageWidth(doc),
        pageHeight: pageHeight(doc),
        y: topMargin,
    }
}

function renderText(text: string, renderState: RenderState) {
    const lineHeight = renderState.doc.getFontSize() * 1.5; // todo
    const docContent = renderState.doc.splitTextToSize(text, renderState.pageWidth);

    for (let i = 0; i < docContent.length; i++) {
        if (renderState.y + lineHeight > renderState.pageHeight) {
            renderState.doc.addPage();
            renderState.y = topMargin;
        }
        renderState.doc.text(docContent[i], leftMargin, renderState.y);
        renderState.y += lineHeight;
    }
}

function getMinimumFontSize(doc: jsPDF) {
    return doc.internal.scaleFactor / doc.getFontSize();
}

function splitTextAtMaxLen(text: string, len: number, doc: jsPDF): [string, string, boolean] {
    let currentLength = 0;
    let last_space = -1;
    let last_newline = -1;

    for (let i = 0; i < text.length; i++) {
        const w = doc.getStringUnitWidth(text[i]) * doc.getFontSize();
        if (text[i] === ' ') {
            last_space = i + 1;
        }
        if (text[i] === '\n') {
            last_newline = i;
        }
        if (currentLength + w > len) {
            if (last_space === -1) {
                last_space = i;
            }
            if (last_newline !== -1) {
                return [text.substring(0, last_newline), text.substring(last_newline + 1), true];
            }
            return [text.substring(0, last_space), text.substring(last_space), false];
        } else if (last_newline !== -1) {
            return [text.substring(0, last_newline), text.substring(last_newline + 1), true];
        }

        currentLength += w;
    }

    if (text.includes('\n')) {
        const splitIndex = text.indexOf('\n');
        return [text.substring(0, splitIndex), text.substring(splitIndex + 1), true];
    }

    return [text, '', false];
}

// https://colorhunt.co/palette/fdffe283b4ff5a72a01a2130
function renderParagraph(tokens: Token[], renderState: RenderState) {
    const lineHeight = renderState.doc.getFontSize() * 1.5;
    let xPos = leftMargin;

    const prevTextColor = renderState.doc.getTextColor();
    const prevFont = renderState.doc.getFont();
    const prevFillColor = renderState.doc.getFillColor();
    for (let i = 0; i < tokens.length; i++) {
        let linkHref: string | undefined = undefined;
        let isCodeSpan = false;
        const token = tokens[i];
        let tokenText = token.raw;
        switch (token.type) {
            case 'text':
                tokenText = token.text;
                break;
            case 'codespan':
                isCodeSpan = true;
                tokenText = token.text;
                renderState.doc.setTextColor(31, 35, 40);
                renderState.doc.setFont('NanumGothic', 'bold');
                break;
            case 'link':
                tokenText = token.text;
                linkHref = token.href;
                renderState.doc.setTextColor(131, 180, 255);
                break;
            case 'strong':
                tokenText = token.text;
                renderState.doc.setFont('NanumGothic', 'bold');
                break;
            default:
        }

        while (tokenText.length > 0) {
            const [toPrint, rest, forceNewLine] = splitTextAtMaxLen(tokenText, (renderState.pageWidth - (xPos - leftMargin)), renderState.doc);
            if (toPrint != '') {
                if (renderState.y + lineHeight > renderState.pageHeight) {
                    renderState.doc.addPage();
                    renderState.y = topMargin;
                }
                const textWidth = renderState.doc.getTextWidth(toPrint);
                if (isCodeSpan) {
                    renderState.doc.setFillColor(253, 255, 226);
                    renderState.doc.rect(xPos - 3, renderState.y - renderState.doc.getFontSize() - 3, textWidth + 6, lineHeight + 6, 'F');
                }
                if (linkHref) {
                    renderState.doc.textWithLink(toPrint, xPos, renderState.y, {url: linkHref});
                } else {
                    renderState.doc.text(toPrint, xPos, renderState.y);
                }
                xPos = xPos + textWidth;
            }
            tokenText = rest;

            let insufficientSpace = forceNewLine;
            if (!insufficientSpace) {
                insufficientSpace = ((xPos - leftMargin) + getMinimumFontSize(renderState.doc) > renderState.pageWidth);
            }
            if (!insufficientSpace) {
                insufficientSpace = (toPrint == '' && rest != '');
            }
            if (insufficientSpace) {
                renderState.y += lineHeight;
                xPos = leftMargin;
            }
        }

        renderState.doc.setTextColor(prevTextColor);
        renderState.doc.setFont(prevFont.fontName, prevFont.fontStyle);
        renderState.doc.setFillColor(prevFillColor);
    }
    if (xPos > leftMargin) {
        renderState.y += lineHeight;
    }
    renderState.y += 10;
}

// function renderTable(table: Tokens.Table, renderState: RenderState) {
//     // for (let j = 0; j < table.header.length; j++) {
//     //     cell += this.renderer.tablecell(
//     //         this.renderMarkdownInline(tableToken.header[j].tokens),
//     //         {header: true, align: tableToken.align[j]}
//     //     );
//     // }
//     console.log(table);
//     autoTable(renderState.doc, {
//         head: [['Name', 'Country', 'Logo']],
//         body: [
//             ['Sweden', 'John', 'logo.png'],
//             ['Canada', 'Simon', 'logo.png'],
//             ['Australia', 'Peter', 'logo.png'],
//         ],
//         // didDrawCell: function (data) {
//         //     if (data.column.index === 2 && data.cell.section === 'body') {
//         //         const imgData = 'data:image/png;base64,iVBORw0KG.....'; // base64 Image Data
//         //         renderState.doc.addImage(imgData, 'PNG', data.cell.x, data.cell.y, data.cell.width, data.cell.height);
//         //     }
//         // }
//     });
// }

function renderCode(code: string, infostring: string | undefined, escaped: boolean, renderState: RenderState): void {
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
        lineHeight: renderState.doc.getFontSize() * 1.5,
        leftPadding: 5,
        rightPadding: 5
    };
    virtualRenderCode(prismTokens, renderState, innerRenderState, virtualRenderState)
    const rects = virtualRenderState.rects;
    rects.push({...virtualRenderState.lastRect});

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
        lineHeight: renderState.doc.getFontSize() * 1.5,
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


function renderMarkdown(tokens: Token[], renderState: RenderState): void {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        switch (token.type) {
            case 'space': {
                continue;
            }
            // case 'hr': {
            //     out += this.renderer.hr();
            //     continue;
            // }
            case 'heading': {
                const headingToken = token as Tokens.Heading;
                const prevFont = renderState.doc.getFont();
                const prevFontSize = renderState.doc.getFontSize();
                renderState.doc.setFont('NanumGothic', 'bold');
                renderState.doc.setFontSize(hFontSize[headingToken.depth]);
                renderText(headingToken.text, renderState);
                renderState.doc.setFont(prevFont.fontName, prevFont.fontStyle);
                renderState.doc.setFontSize(prevFontSize);
                break;
            }
            case 'code': {
                const codeToken = token as Tokens.Code;
                renderCode(codeToken.text, codeToken.lang, !!codeToken.escaped, renderState);
                break;
            }
            // case 'table': {
            //     // const tableToken = token as Tokens.Table;
            //     // let header = '';
            //     //
            //     // // header
            //     // let cell = '';
            //     // for (let j = 0; j < tableToken.header.length; j++) {
            //     //     cell += this.renderer.tablecell(
            //     //         this.renderMarkdownInline(tableToken.header[j].tokens),
            //     //         {header: true, align: tableToken.align[j]}
            //     //     );
            //     // }
            //     // header += this.renderer.tablerow(cell);
            //     //
            //     // let body = '';
            //     // for (let j = 0; j < tableToken.rows.length; j++) {
            //     //     const row = tableToken.rows[j];
            //     //
            //     //     cell = '';
            //     //     for (let k = 0; k < row.length; k++) {
            //     //         cell += this.renderer.tablecell(
            //     //             this.renderMarkdownInline(row[k].tokens),
            //     //             {header: false, align: tableToken.align[k]}
            //     //         );
            //     //     }
            //     //
            //     //     body += this.renderer.tablerow(cell);
            //     // }
            //     // out += this.renderer.table(header, body);
            //     renderTable(token as Tokens.Table, renderState);
            //     break;
            // }
            // case 'blockquote': {
            //     const blockquoteToken = token as Tokens.Blockquote;
            //     const body = this.parse(blockquoteToken.tokens);
            //     out += this.renderer.blockquote(body);
            //     continue;
            // }
            // case 'list': {
            //     const listToken = token as Tokens.List;
            //     const ordered = listToken.ordered;
            //     const start = listToken.start;
            //     const loose = listToken.loose;
            //
            //     let body = '';
            //     for (let j = 0; j < listToken.items.length; j++) {
            //         const item = listToken.items[j];
            //         const checked = item.checked;
            //         const task = item.task;
            //
            //         let itemBody = '';
            //         if (item.task) {
            //             const checkbox = this.renderer.checkbox(!!checked);
            //             if (loose) {
            //                 if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
            //                     item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
            //                     if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
            //                         item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
            //                     }
            //                 } else {
            //                     item.tokens.unshift({
            //                         type: 'text',
            //                         text: checkbox + ' '
            //                     } as Tokens.Text);
            //                 }
            //             } else {
            //                 itemBody += checkbox + ' ';
            //             }
            //         }
            //
            //         itemBody += this.parse(item.tokens, loose);
            //         body += this.renderer.listitem(itemBody, task, !!checked);
            //     }
            //
            //     out += this.renderer.list(body, ordered, start);
            //     continue;
            // }
            // case 'html': {
            //     const htmlToken = token as Tokens.HTML;
            //     out += this.renderer.html(htmlToken.text, htmlToken.block);
            //     continue;
            // }
            case 'paragraph': {
                const paragraphToken = token as Tokens.Paragraph;
                renderParagraph(paragraphToken.tokens, renderState);
                break;
            }
            case 'text': {
                let textToken = token as Tokens.Text;
                textToken.tokens ? renderMarkdownInline(textToken.tokens, renderState) : textToken.text;
                while (i + 1 < tokens.length && tokens[i + 1].type === 'text') {
                    textToken = tokens[++i] as Tokens.Text;
                    renderText('\n', renderState);
                    textToken.tokens ? renderMarkdownInline(textToken.tokens, renderState) : textToken.text;
                }
                // out += top ? this.renderer.paragraph(body) : body;
                break;
            }

            default: {
                // renderText(token.raw, renderState);
                // const errMsg = 'Token with "' + token.type + '" type was not found.';
                // if (this.options.silent) {
                //     console.error(errMsg);
                //     return '';
                // } else {
                //     throw new Error(errMsg);
                // }
            }
        }
    }

    // return out;
}

function renderMarkdownInline(tokens: Token[], renderState: RenderState): void {
//     renderer = renderer || this.renderer;
//     let out = '';
//
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
//
//         // Run any renderer extensions
//         if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
//             const ret = this.options.extensions.renderers[token.type].call({parser: this}, token);
//             if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
//                 out += ret || '';
//                 continue;
//             }
//         }
//
        switch (token.type) {
//             case 'escape': {
//                 const escapeToken = token as Tokens.Escape;
//                 out += renderer.text(escapeToken.text);
//                 break;
//             }
//             case 'html': {
//                 const tagToken = token as Tokens.Tag;
//                 out += renderer.html(tagToken.text);
//                 break;
//             }
//             case 'link': {
//                 const linkToken = token as Tokens.Link;
//                 out += renderer.link(linkToken.href, linkToken.title, this.parseInline(linkToken.tokens, renderer));
//                 break;
//             }
//             case 'image': {
//                 const imageToken = token as Tokens.Image;
//                 out += renderer.image(imageToken.href, imageToken.title, imageToken.text);
//                 break;
//             }
//             case 'strong': {
//                 const strongToken = token as Tokens.Strong;
//                 out += renderer.strong(this.parseInline(strongToken.tokens, renderer));
//                 break;
//             }
//             case 'em': {
//                 const emToken = token as Tokens.Em;
//                 out += renderer.em(this.parseInline(emToken.tokens, renderer));
//                 break;
//             }
//             case 'codespan': {
//                 const codespanToken = token as Tokens.Codespan;
//                 out += renderer.codespan(codespanToken.text);
//                 break;
//             }
//             case 'br': {
//                 out += renderer.br();
//                 break;
//             }
//             case 'del': {
//                 const delToken = token as Tokens.Del;
//                 out += renderer.del(this.parseInline(delToken.tokens, renderer));
//                 break;
//             }
            case 'text': {
                const textToken = token as Tokens.Text;
                renderText(textToken.text, renderState);
                break;
            }

            default: {
                // renderText(token.raw, renderState);
                // const errMsg = 'Token with "' + token.type + '" type was not found.';
                // if (this.options.silent) {
                //     console.error(errMsg);
                //     return '';
                // } else {
                //     throw new Error(errMsg);
                // }
            }
        }
    }
//     return out;
}

export {renderMarkdown, getRenderState}
