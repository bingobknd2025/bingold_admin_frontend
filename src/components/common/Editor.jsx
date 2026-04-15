import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    SelectAll,
    Table,
    TableCaption,
    TableCellProperties,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import api from '../../utils/axios';

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    api.post('/admin/common/upload-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then((response) => {
                            if (response.data && response.data.data && response.data.data.url) {
                                resolve({
                                    default: response.data.data.url
                                });
                            } else {
                                reject(response.data.message || 'Upload failed');
                            }
                        })
                        .catch((error) => {
                            reject(error.response?.data?.message || error.message || 'Upload failed');
                        });
                })
        );
    }

    abort() {
        // Abort not implemented
    }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

const Editor = ({ value, onChange, placeholder }) => {
    return (
        <div className="ck-editor-container">
            <CKEditor
                editor={ClassicEditor}
                data={value || ''}
                config={{
                    toolbar: {
                        items: [
                            'undo', 'redo', '|',
                            'heading', '|',
                            'bold', 'italic', 'underline', '|',
                            'link', 'insertImage', 'mediaEmbed', 'insertTable', 'blockQuote', '|',
                            'bulletedList', 'numberedList', 'outdent', 'indent'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    plugins: [
                        AccessibilityHelp, Autoformat, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials,
                        Heading, ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize,
                        ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic,
                        Link, LinkImage, List, ListProperties, MediaEmbed, Paragraph, PasteFromOffice, SelectAll,
                        Table, TableCaption, TableCellProperties, TableProperties, TableToolbar,
                        TextTransformation, Underline, Undo, MyCustomUploadAdapterPlugin
                    ],
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                        ]
                    },
                    image: {
                        toolbar: [
                            'toggleImageCaption', 'imageTextAlternative', '|',
                            'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|',
                            'linkImage'
                        ]
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                    },
                    placeholder: placeholder || 'Type your content here...',
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    licenseKey: 'GPL'
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
            <style>{`
                .ck-editor__editable_inline {
                    min-height: 300px;
                    max-height: 600px;
                }
                .ck-content {
                    font-size: 1rem;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default Editor;
