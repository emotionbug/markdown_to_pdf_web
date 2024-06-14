import {Token} from "marked";
import RenderState from "../RenderState.ts";
import {defaultLineHeight, leftMargin, topMargin} from "../Consts.ts";
import {getCurrentDocState, getMinimumFontSize, restoreDocState, splitTextAtMaxLen} from "../RendererHelper.ts";

export default function renderParagraph(tokens: Token[], renderState: RenderState) {
    const lineHeight = renderState.doc.getFontSize() * defaultLineHeight;
    let xPos = leftMargin;

    const prevState = getCurrentDocState(renderState.doc);
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

        restoreDocState(renderState.doc, prevState);
    }
    if (xPos > leftMargin) {
        renderState.y += lineHeight;
    }
    renderState.y += 10;
}
