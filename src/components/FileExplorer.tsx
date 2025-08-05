import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { FileText, Folder, Save, Pencil, Trash2 } from 'lucide-react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { useAppStore, type FileEntry } from '../store/useAppStore';

const FileExplorer: React.FC = () => {
  const {
    fileStructure,
    selectedFile,
    fileContent,
    isFileExplorerLoading,
    fileExplorerError,
    isFileViewDialogOpen,
    isFileEditing,
    fetchFileStructure,
    selectFile,
    updateFileContent,
    saveEditedFile,
    deleteSelectedFile,
    setIsFileEditing,
    setIsFileViewDialogOpen,
  } = useAppStore(state => state.fileExplorer);

  useEffect(() => {
    fetchFileStructure();
  }, [fetchFileStructure]);

  const handleFileClick = async (file: FileEntry) => {
    await selectFile(file);
  };

  const handleSaveFile = async () => {
    await saveEditedFile();
  };

  const handleDeleteFile = async () => {
    await deleteSelectedFile();
  };

  const renderFileTree = (parentId: number | null = null) => {
    return (
      <ul className="ml-4">
        {fileStructure
          .filter(item => item.parent_id === parentId)
          .sort((a, b) => {
            if (a.type === 'directory' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'directory') return 1;
            return a.name.localeCompare(b.name);
          })
          .map(item => (
            <li key={item.id} className="cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-primary/10">
              <span onClick={() => handleFileClick(item)} className="flex items-center">
                {item.type === 'directory' ? <Folder className="inline-block mr-2 h-4 w-4 text-orange-500" /> : <FileText className="inline-block mr-2 h-4 w-4 text-blue-500" />} {item.name}
              </span>
              {item.type === 'directory' && renderFileTree(item.id)}
            </li>
          ))}
      </ul>
    );
  };

  const getFileLanguage = (fileName: string) => {
    const parts = fileName.split('.');
    if (parts.length > 1) {
      const extension = parts[parts.length - 1];
      switch (extension) {
        case 'js':
        case 'jsx': return 'javascript';
        case 'ts':
        case 'tsx': return 'typescript';
        case 'py': return 'python';
        case 'json': return 'json';
        case 'md': return 'markdown';
        case 'css': return 'css';
        case 'html': return 'html';
        case 'xml': return 'xml';
        case 'java': return 'java';
        case 'c': return 'c';
        case 'cpp': return 'cpp';
        case 'sh': return 'bash';
        case 'yml':
        case 'yaml': return 'yaml';
        default: return 'text';
      }
    }
    return 'text';
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">File Explorer</h2>
      {isFileExplorerLoading && <p>Loading...</p>}
      {fileExplorerError && <p className="text-red-500">{fileExplorerError}</p>}

      <div className="border rounded-md p-4 max-h-96 overflow-auto">
        {renderFileTree()}
      </div>

      {selectedFile && (
        <Dialog open={isFileViewDialogOpen} onOpenChange={setIsFileViewDialogOpen}>
          <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedFile.name}</DialogTitle>
              <DialogDescription>{selectedFile.relativePath}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 flex-grow overflow-auto">
              {!isFileEditing ? (
                <SyntaxHighlighter
                  language={getFileLanguage(selectedFile.name)}
                  style={docco}
                  showLineNumbers={true}
                  customStyle={{ width: '100%', height: '100%', overflow: 'auto' }}
                >
                  {fileContent}
                </SyntaxHighlighter>
              ) : (
                <Textarea
                  value={fileContent}
                  onChange={(e) => updateFileContent(e.target.value)}
                  className="w-full h-full font-mono text-sm resize-none"
                />
              )}
            </div>
            <DialogFooter className="flex justify-between items-center">
              <div>
                <Button variant="destructive" onClick={handleDeleteFile} className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
              <div className="flex space-x-2">
                {!isFileEditing && (
                  <Button onClick={() => setIsFileEditing(true)} className="flex items-center space-x-2">
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                )}
                {isFileEditing && (
                  <Button type="submit" onClick={handleSaveFile} className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save changes</span>
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FileExplorer;
