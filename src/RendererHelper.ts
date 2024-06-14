import jsPDF, {Font} from "jspdf";

interface SavedDocState {
    readonly font: Font;
    readonly fontSize: number;
    readonly textColor: string;
}

export function getCurrentDocState(doc: jsPDF): SavedDocState {
    const font = doc.getFont();
    const fontSize = doc.getFontSize();
    const textColor = doc.getTextColor();
    return {font, fontSize, textColor};
}

export function restoreDocState(doc: jsPDF, state: SavedDocState) {
    doc.setFont(state.font.fontName, state.font.fontStyle);
    doc.setFontSize(state.fontSize);
    doc.setTextColor(state.textColor);
}

export function getMinimumFontSize(doc: jsPDF) {
    return doc.internal.scaleFactor / doc.getFontSize();
}

export function splitTextAtMaxLen(text: string, len: number, doc: jsPDF): [string, string, boolean] {
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
