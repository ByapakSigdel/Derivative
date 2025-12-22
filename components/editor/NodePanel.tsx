"use client";
import { useEditorStore } from "@/store/editorStore";
import Button from "@/components/ui/Button";
import { NodeType } from "@/types/graph";

export default function NodePanel() {
  const { addNode } = useEditorStore();

  const add = (type: NodeType) => () => {
    addNode(type);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Nodes</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={add("DigitalWrite")}>Digital Write</Button>
        <Button onClick={add("AnalogRead")}>Analog Read</Button>
        <Button onClick={add("Delay")}>Delay</Button>
        <Button onClick={add("If")}>If</Button>
        <Button onClick={add("Loop")}>Loop</Button>
      </div>
    </div>
  );
}
