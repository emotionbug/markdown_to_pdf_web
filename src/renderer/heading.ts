import {Tokens} from "marked";
import RenderState from "../RenderState.ts";
import renderText from "./text.ts";
import {getCurrentDocState, restoreDocState} from "../RendererHelper.ts";

const hFontSize = [32, 24, 18.72, 16, 13.28, 10.72];

export default function renderHeading(headingToken: Tokens.Heading, renderState: RenderState) {
    const prevState = getCurrentDocState(renderState.doc);

    renderState.doc.setFont('NanumGothic', 'bold');
    renderState.doc.setFontSize(hFontSize[headingToken.depth]);
    renderText(headingToken.text, renderState);

    restoreDocState(renderState.doc, prevState);
}
