import {Token, Tokens} from "marked";
import RenderState from "./RenderState.ts";
import headingRender from './renderer/heading.ts'
import renderText from "./renderer/text.ts";
import renderCode from "./renderer/code.ts";
import renderParagraph from "./renderer/paragraph.ts";

// https://colorhunt.co/palette/fdffe283b4ff5a72a01a2130

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
                headingRender(token as Tokens.Heading, renderState);
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

export {renderMarkdown}
