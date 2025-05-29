import React from 'react';
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode, FaParagraph,
  FaCopy, FaDownload
} from 'react-icons/fa6';
import { FaRedoAlt, FaTimes, FaUndoAlt } from 'react-icons/fa';
import {
  RiH1, RiH2, RiH3, RiH4, RiH5, RiH6, RiCodeBlock
} from 'react-icons/ri';
import { GoListOrdered } from 'react-icons/go';
import { RxLetterCaseUppercase, RxLetterCaseLowercase } from 'react-icons/rx';
import { MdFormatListBulleted, MdHorizontalRule, MdDelete } from 'react-icons/md';

const headingIcons = {
  1: <RiH1 />,
  2: <RiH2 />,
  3: <RiH3 />,
  4: <RiH4 />,
  5: <RiH5 />,
  6: <RiH6 />,
};

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const run = (commandFn) => editor.chain().focus()[commandFn]().run();

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <button onClick={() => run('toggleBold')}><FaBold /></button>
      <button onClick={() => run('toggleItalic')}><FaItalic /></button>
      <button onClick={() => run('toggleUnderline')}><FaUnderline /></button>
      <button onClick={() => run('toggleStrike')}><FaStrikethrough /></button>
      <button onClick={() => run('toggleCode')}><FaCode /></button>
      <button onClick={() => run('setParagraph')}><FaParagraph /></button>

      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          {headingIcons[level]}
        </button>
      ))}

      <button onClick={() => run('toggleBulletList')}><MdFormatListBulleted /></button>
      <button onClick={() => run('toggleOrderedList')}><GoListOrdered /></button>
      <button onClick={() => run('toggleCodeBlock')}><RiCodeBlock /></button>
      <button onClick={() => run('setHorizontalRule')}><MdHorizontalRule /></button>
      <button onClick={() => run('setHardBreak')}>br</button>
      <button onClick={() => run('undo')}><FaUndoAlt /></button>
      <button onClick={() => run('redo')}><FaRedoAlt /></button>

      <button onClick={() => editor.commands.setContent(editor.getText().toUpperCase())}>
        <RxLetterCaseUppercase />
      </button>
      <button onClick={() => editor.commands.setContent(editor.getText().toLowerCase())}>
        <RxLetterCaseLowercase />
      </button>
      <button onClick={() => editor.commands.clearContent()}><MdDelete /></button>
      <button onClick={() => navigator.clipboard.writeText(editor.getText())}><FaCopy /></button>
      <button onClick={() => editor.commands.setContent(editor.getText().replace(/\s+/g, ''))}>
        <FaTimes />
      </button>

      <button
        onClick={() => {
          const blob = new Blob([editor.getHTML()], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'editor-content.txt';
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        <FaDownload />
      </button>
    </div>
  );
};

export default EditorToolbar;
