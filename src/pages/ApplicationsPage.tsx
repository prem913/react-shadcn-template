import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ApplicationsSidebar } from '@/components/ApplicationsSidebar';
import { Chatbot } from '@/components/Chatbot';

export default function ApplicationsPage() {
  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full max-w-full">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <ApplicationsSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={60}>
          <Chatbot />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
