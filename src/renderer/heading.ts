import {Tokens} from "marked";
import RenderState from "../RenderState.ts";
import renderText from "./text.ts";

const hFontSize = [32, 24, 18.72, 16, 13.28, 10.72];

export default function renderHeading(headingToken: Tokens.Heading, renderState: RenderState) {
    const prevFont = renderState.doc.getFont();
    const prevFontSize = renderState.doc.getFontSize();
    renderState.doc.setFont('NanumGothic', 'bold');
    renderState.doc.setFontSize(hFontSize[headingToken.depth]);
    renderText(headingToken.text, renderState);
    renderState.doc.setFont(prevFont.fontName, prevFont.fontStyle);
    renderState.doc.setFontSize(prevFontSize);
}
