import './App.scss';
import React from 'react';
import jsPDF from 'jspdf';
import {marked} from "marked";
import {sampleMarkdown} from "./SampleData.ts";
import {renderMarkdown} from "./PdfRenderer.ts";
import {getRenderState} from "./RenderState.ts";

interface Props {

}

interface State {
    NanumGothic: ArrayBuffer | null;
    NanumGothicBold: ArrayBuffer | null;
    D2Coding: ArrayBuffer | null;
    D2CodingBold: ArrayBuffer | null;
    isLoading: boolean;
    pdfBlobURL: string | null;
    markdown: string;
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            NanumGothic: null,
            NanumGothicBold: null,
            D2Coding: null,
            D2CodingBold: null,
            isLoading: true,
            pdfBlobURL: null,
            markdown: sampleMarkdown,
        };
    }

    downloadAndReadFile = (url: string) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const fontName = url.split('/').pop()?.replace('.ttf', '') as 'NanumGothic' | 'NanumGothicBold' | 'D2Coding' | 'D2CodingBold';
                    this.setState({[fontName]: reader.result} as Pick<State, typeof fontName>, () => {
                        const {NanumGothic, NanumGothicBold, D2Coding, D2CodingBold} = this.state;
                        if (NanumGothic && NanumGothicBold && D2Coding && D2CodingBold) {
                            this.setState({isLoading: false});
                        }
                    });
                };
                reader.readAsArrayBuffer(blob);
            })
            .catch(error => console.error("There was an error!", error));
    };

    componentDidMount() {
        const TTF_URLs = [
            'https://hangeul.pstatic.net/hangeul_static/webfont/NanumGothic/NanumGothic.ttf',
            'https://hangeul.pstatic.net/hangeul_static/webfont/NanumGothic/NanumGothicBold.ttf',
            'https://hangeul.pstatic.net/hangeul_static/webfont/NanumGothicCoding/D2Coding.ttf',
            'https://hangeul.pstatic.net/hangeul_static/webfont/NanumGothicCoding/D2CodingBold.ttf',
        ];

        console.log('componentDidMount')
        TTF_URLs.forEach(url => this.downloadAndReadFile(url));
    }

    arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }

    generatePDF = async () => {
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });

        doc.addFileToVFS('NanumGothic.ttf', this.arrayBufferToBase64(this.state.NanumGothic!));
        doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');

        doc.addFileToVFS('NanumGothicBold.ttf', this.arrayBufferToBase64(this.state.NanumGothicBold!));
        doc.addFont('NanumGothicBold.ttf', 'NanumGothic', 'bold');

        doc.addFileToVFS('D2Coding.ttf', this.arrayBufferToBase64(this.state.D2Coding!));
        doc.addFont('D2Coding.ttf', 'D2Coding', 'normal');

        doc.addFileToVFS('D2CodingBold.ttf', this.arrayBufferToBase64(this.state.D2CodingBold!));
        doc.addFont('D2CodingBold.ttf', 'D2Coding', 'bold');

        doc.setFontSize(12);
        doc.setFont('NanumGothic', 'normal');

        const tokens = marked.lexer(this.state.markdown);
        console.log(tokens);
        const renderState = getRenderState(doc);
        renderMarkdown(tokens, renderState);

        const blob = doc.output('blob');
        const pdfBlobURL = URL.createObjectURL(blob);
        this.setState({pdfBlobURL: pdfBlobURL});
    };

    onMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!event) return;
        this.setState({markdown: event.target.value});
    }

    render() {
        const {isLoading, pdfBlobURL, markdown} = this.state;
        return (
            <div className="container">
                {!isLoading && (
                    <>
                        <div className="controls">
                            <button onClick={this.generatePDF}>Generate PDF</button>
                        </div>
                        <div className="pane">
                            <div className="left_pane">
                                <textarea value={markdown} onChange={this.onMarkdownChange}
                                          placeholder="Place your text here..."/>
                            </div>
                            <div className="right_pane">
                                {!isLoading && pdfBlobURL && (
                                    <embed src={pdfBlobURL} type="application/pdf"/>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {isLoading && (
                    <div>
                        Loading..
                    </div>
                )}
            </div>
        );
    }
}

export default App;

