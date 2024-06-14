import RenderState from "../RenderState.ts";
import {defaultLineHeight, leftMargin, topMargin} from "../Consts.ts";

export default function renderText(text: string, renderState: RenderState) {
    const lineHeight = renderState.doc.getFontSize() * defaultLineHeight; // todo
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
