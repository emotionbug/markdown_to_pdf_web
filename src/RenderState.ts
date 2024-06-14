import jsPDF from "jspdf";
import {bottomMargin, leftMargin, rightMargin, topMargin} from "./Consts.ts";

export default interface RenderState {
    readonly doc: jsPDF;
    readonly pageWidth: number;
    readonly pageHeight: number;
    y: number;
}

export function getRenderState(doc: jsPDF): RenderState {
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
