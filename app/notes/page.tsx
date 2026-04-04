"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";
import AddTaskModal from "../components/add-task-modal";
import { useApp } from "../context";

export default function NotesPage() {
  const { notes, updateNote, addNote, deleteNote } = useApp();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleSelectNote = (note: typeof notes[0]) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCreateNote = () => {
    addNote({ title: "บันทึกใหม่", content: "", category: "Notes", color: "primary", isFavorite: false });
  };

  const handleSaveNote = () => {
    if (!selectedNoteId) return;
    updateNote(selectedNoteId, { title, content });
  };

  const handleDeleteNote = () => {
    if (!selectedNoteId) return;
    deleteNote(selectedNoteId);
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="bg-background text-on-surface flex min-h-screen">
      <Sidebar />
      <main className="flex-grow md:ml-72 min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tighter text-blue-300">Ethereal Chronos</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="material-symbols-outlined text-slate-400 hover:text-blue-200 transition-colors cursor-pointer">notifications</span>
          </div>
        </header>
        <div className="flex flex-col lg:flex-row flex-grow p-6 gap-6 relative z-10 overflow-hidden h-[calc(100vh-72px)]">
          <section className="w-full lg:w-80 flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-on-surface">บันทึกล่าสุด</h2>
              <div className="flex gap-2">
                <button onClick={handleCreateNote} className="p-1 rounded-lg hover:bg-surface-container-high text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3 pr-2 pb-10">
              {notes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                  <span className="material-symbols-outlined text-4xl mb-2">note_add</span>
                  <p className="text-xs font-bold uppercase tracking-widest">ยังไม่มีบันทึก</p>
                </div>
              )}
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-5 rounded-lg border relative overflow-hidden group transition-all duration-300 cursor-pointer ${
                    selectedNoteId === note.id
                      ? "bg-surface-container-high border-outline-variant/15"
                      : "bg-surface-container-low/50 border-outline-variant/5 hover:bg-surface-container-high"
                  }`}
                >
                  {selectedNoteId === note.id && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      note.color === "primary" ? "text-primary" :
                      note.color === "secondary" ? "text-secondary" : "text-tertiary"
                    }`}>{note.category}</span>
                    <span className="text-[10px] text-on-surface-variant">{note.updatedAt}</span>
                  </div>
                  <h3 className="font-bold text-on-surface leading-tight mb-2">{note.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{note.content.substring(0, 100)}...</p>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="flex-grow glass-panel bg-surface-variant/40 rounded-lg flex flex-col border border-outline-variant/10 overflow-hidden">
            {!selectedNoteId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">edit_note</span>
                  <p className="text-on-surface-variant">เลือกบันทึกหรือสร้างใหม่</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-lg">format_bold</span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-lg">format_italic</span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveNote}
                      className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-primary px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">save</span>
                      <span>บันทึก</span>
                    </button>
                  </div>
                </div>
                <div className="px-10 py-8 space-y-4">
                  <input
                    className="w-full bg-transparent border-none text-4xl font-extrabold tracking-tight text-on-surface focus:ring-0 placeholder-on-surface-variant/30 px-0"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="ชื่อบันทึก..."
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedNote && (
                      <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{selectedNote.category}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow px-10 pb-10 overflow-y-auto">
                  <textarea
                    className="w-full h-full bg-transparent border-none text-on-surface-variant leading-relaxed text-lg focus:ring-0 resize-none p-0 placeholder-on-surface-variant/20"
                    placeholder="เริ่มเขียนที่นี่..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
      <AddTaskModal />
    </div>
  );
}
