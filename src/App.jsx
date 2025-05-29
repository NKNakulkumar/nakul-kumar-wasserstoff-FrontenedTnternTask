import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import JoinScreen from './components/JoinScreen';
import EditorToolbar from './components/EditorToolbar';
import EditorPanel from './components/EditorPanel';
import LineHistory from './components/LineHistory';
import './App.css';

const CHANNEL_NAME = 'frontend-editor-broadcast';
const STORAGE_KEY = 'editor-content';
const extensions = [StarterKit, Underline];

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [value, setValue] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [lineEditorsHistory, setLineEditorsHistory] = useState({});
  const channelRef = useRef(null);

  const editor = useEditor({
    extensions,
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setValue(html);

      const lines = text.split('\n').filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== '');
      const { from, to } = editor.state.selection;
      const startLine = text.substring(0, from).split('\n').length - 1;
      const endLine = text.substring(0, to).split('\n').length - 1;
      const newLineEditorsHistory = { ...lineEditorsHistory };

      for (let index = startLine; index <= endLine; index++) {
        if (!newLineEditorsHistory[index]) newLineEditorsHistory[index] = [];
        const currentEditors = newLineEditorsHistory[index];
        const latestEditor = currentEditors[0] || null;
        if (!latestEditor || latestEditor.username !== username) {
          newLineEditorsHistory[index] = [
            { username, timestamp: new Date().toISOString() },
            ...(latestEditor ? [latestEditor] : []),
          ].slice(0, 2);
        }
      }

      setLineEditorsHistory(newLineEditorsHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ content: html, editorsHistory: newLineEditorsHistory }));
      channelRef.current?.postMessage({ type: 'update', payload: { content: html, editorsHistory: newLineEditorsHistory } });
    },
  });

  useEffect(() => {
    if (!joined || !editor) return;

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved.content) editor.commands.setContent(saved.content);
    if (saved.editorsHistory) setLineEditorsHistory(saved.editorsHistory);

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.postMessage({ type: 'user-join', user: username });

    channel.onmessage = ({ data: msg }) => {
      if (msg.type === 'update') {
        editor?.commands.setContent(msg.payload.content);
        setLineEditorsHistory(msg.payload.editorsHistory || {});
      } else if (msg.type === 'user-join') {
        setActiveUsers((prev) => (prev.includes(msg.user) ? prev : [...prev, msg.user]));
      }
    };

    return () => channel.close();
  }, [joined, username, editor]);

  const handleJoin = () => {
    if (username.trim()) {
      setJoined(true);
      setActiveUsers((prev) => [...new Set([...prev, username])]);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    editor?.commands.clearContent();
    setLineEditorsHistory({});
    channelRef.current?.postMessage({ type: 'update', payload: { content: '', editorsHistory: {} } });
  };

  if (!joined) return <JoinScreen username={username} setUsername={setUsername} onJoin={handleJoin} />;
  if (!editor) return null;

  const lines = editor.getText().split('\n').filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== '');

  return (
    <div className="min-h-screen bg-[#050D4A] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
          <h3 className="text-2xl font-semibold">📝 Rich Collaborative Editor</h3>
          <button className="bg-red-500 px-4 py-2 rounded shadow" onClick={handleClear}>🗑 Clear All</button>
        </div>

        <p><strong>You:</strong> {username}</p>
        <p><strong>Users Online:</strong> {activeUsers.join(', ')}</p>

        <EditorToolbar editor={editor} />
        <EditorPanel editor={editor} html={value} />
        <LineHistory lines={lines} history={lineEditorsHistory} />
      </div>
    </div>
  );
}

export default App;
