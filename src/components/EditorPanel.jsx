import React from 'react';
import { EditorContent } from '@tiptap/react';
import { MdPreview } from 'react-icons/md';

const EditorPanel = ({ editor, html }) => {
  const wordCount = html.split(" ").filter(Boolean).length;

  return (
    <>
      <EditorContent editor={editor} className="bg-white text-black p-4 rounded-lg shadow" />
      <div className="mt-6">
        <h4 className="text-xl">🧾 Your Text Summary</h4>
        <p>{wordCount} words and {html.length} characters</p>
        <p>{(wordCount * 0.008).toFixed(2)} minutes read</p>
        <div className="flex items-center space-x-2">
          <MdPreview className="text-xl" />
          <h2 className="text-xl">Preview</h2>
        </div>
        <div className="mt-4 p-4 bg-slate-800 rounded" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
};

export default EditorPanel;
