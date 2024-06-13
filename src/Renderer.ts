import {cleanUrl, escape} from "./helper.ts";

export class _Renderer {
    code(code: string, infostring: string | undefined, escaped: boolean): string {
        const lang = (infostring || '').match(/^\S*/)?.[0];

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return '<pre><code>'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }

        return '<pre><code class="language-'
            + escape(lang)
            + '">'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
    }

    blockquote(quote: string): string {
        return `<blockquote>\n${quote}</blockquote>\n`;
    }

    html(html: string): string {
        // block?: boolean
        return html;
    }

    heading(text: string, level: number): string {
        // , raw: string
        // ignore IDs
        return `<h${level}>${text}</h${level}>\n`;
    }

    hr(): string {
        return '<hr>\n';
    }

    list(body: string, ordered: boolean, start: number | ''): string {
        const type = ordered ? 'ol' : 'ul';
        const startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
    }

    listitem(text: string): string {
        // , task: boolean, checked: boolean
        return `<li>${text}</li>\n`;
    }

    checkbox(checked: boolean): string {
        return '<input '
            + (checked ? 'checked="" ' : '')
            + 'disabled="" type="checkbox">';
    }

    paragraph(text: string): string {
        return `<p>${text}</p>\n`;
    }

    table(header: string, body: string): string {
        if (body) body = `<tbody>${body}</tbody>`;

        return '<table>\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + body
            + '</table>\n';
    }

    tablerow(content: string): string {
        return `<tr>\n${content}</tr>\n`;
    }

    tablecell(content: string, flags: {
        header: boolean;
        align: 'center' | 'left' | 'right' | null;
    }): string {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
            ? `<${type} align="${flags.align}">`
            : `<${type}>`;
        return tag + content + `</${type}>\n`;
    }

    /**
     * span level renderer
     */
    strong(text: string): string {
        return `<strong>${text}</strong>`;
    }

    em(text: string): string {
        return `<em>${text}</em>`;
    }

    codespan(text: string): string {
        return `<code>${text}</code>`;
    }

    br(): string {
        return '<br>';
    }

    del(text: string): string {
        return `<del>${text}</del>`;
    }

    link(href: string, title: string | null | undefined, text: string): string {
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;
        let out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    }

    image(href: string, title: string | null, text: string): string {
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;

        let out = `<img src="${href}" alt="${text}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += '>';
        return out;
    }

    text(text: string): string {
        return text;
    }
}

export default _Renderer;
