import NodeCanvas from "@/components/editor/NodeCanvas";
import NodePanel from "@/components/editor/NodePanel";
import CodePreview from "@/components/editor/CodePreview";
import UploadPanel from "@/components/editor/UploadPanel";

export const metadata = {
  title: "Editor | Arduino Visual Scripting",
};

export default function EditorPage() {
  return (
    <main className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-9 rounded-xl border border-gray-200 bg-white">
        <NodeCanvas />
      </div>
      <div className="col-span-3 flex flex-col gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <NodePanel />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <CodePreview />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <UploadPanel />
        </div>
      </div>
    </main>
  );
}
