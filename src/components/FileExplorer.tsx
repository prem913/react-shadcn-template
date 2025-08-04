import React, { useState, useEffect } from 'react';
import { getFileStructure, getFileContent, saveFile, deleteFile } from '../lib/api';
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

interface FileEntry {
  id: number;
  name: string;
  type: 'file' | 'directory';
  parent_id: number | null;
  relativePath?: string; // Add relativePath for easier handling
}

const FileExplorer: React.FC = () => {
  const [fileStructure, setFileStructure] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchFileStructure();
  }, []);

  const fetchFileStructure = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFileStructure();
      // Calculate relative paths for files
      const structureWithRelativePaths = calculateRelativePaths(data);
      setFileStructure(structureWithRelativePaths);
    } catch (err) {
      setError('Failed to fetch file structure.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRelativePaths = (structure: FileEntry[]): FileEntry[] => {
    const idMap = new Map<number, FileEntry>(structure.map(item => [item.id, item]));
    const getPath = (item: FileEntry): string => {
      if (item.parent_id === null || item.name === 'adk_projects_runner') { // Assuming 'adk_projects_runner' is the root
        return item.name;
      }
      const parent = idMap.get(item.parent_id);
      if (parent) {
        return `${getPath(parent)}/${item.name}`;
      }
      return item.name;
    };

    return structure.map(item => ({
      ...item,
      relativePath: getPath(item).replace(/^adk_projects_runner\/?/, ''), // Remove base directory prefix
    }));
  };

  const handleFileClick = async (file: FileEntry) => {
    if (file.type === 'file' && file.relativePath) {
      setSelectedFile(file);
      setIsLoading(true);
      setError(null);
      setIsEditing(false); // Always show highlighted view first
      try {
        const content = await getFileContent(file.relativePath);
        setFileContent(content);
        setIsDialogOpen(true);
      } catch (err) {
        setError(`Failed to fetch content for ${file.name}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else if (file.type === 'directory') {
      // Optionally expand/collapse directories here if implementing a tree view
      console.log('Clicked directory:', file.name);
    }
  };

  const handleSaveFile = async () => {
    if (selectedFile && selectedFile.relativePath) {
      setIsLoading(true);
      setError(null);
      try {
        await saveFile(selectedFile.relativePath, fileContent);
        alert('File saved successfully!');
        setIsEditing(false); // Switch back to highlighted view
        fetchFileStructure(); // Refresh structure in case new files were added/modified
      } catch (err) {
        setError(`Failed to save ${selectedFile.name}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteFile = async () => {
    if (selectedFile && selectedFile.relativePath) {
      if (!confirm(`Are you sure you want to delete ${selectedFile.name}?`)) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        await deleteFile(selectedFile.relativePath);
        alert('File deleted successfully!');
        setIsDialogOpen(false);
        setSelectedFile(null);
        setFileContent('');
        fetchFileStructure(); // Refresh structure
      } catch (err) {
        setError(`Failed to delete ${selectedFile.name}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
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
            <li key={item.id} className="cursor-pointer p-1 rounded-md transition-colors duration-200 hover:bg-accent hover:text-accent-foreground">
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
      // Basic mapping, can be expanded
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
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="border rounded-md p-4 max-h-96 overflow-auto">
        {renderFileTree()}
      </div>

      {selectedFile && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedFile.name}</DialogTitle>
              <DialogDescription>{selectedFile.relativePath}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 flex-grow overflow-auto">
              {!isEditing ? (
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
                  onChange={(e) => setFileContent(e.target.value)}
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
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                )}
                {isEditing && (
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