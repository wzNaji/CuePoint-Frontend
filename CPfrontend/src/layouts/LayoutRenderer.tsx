// src/layouts/LayoutRenderer.tsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { WIDGETS } from "./widgets";
import type { WidgetProps, UserLayout, LayoutItem } from "./types";

interface LayoutRendererProps {
  layout: UserLayout;
  contextProps: WidgetProps;
  onLayoutChange?: (newLayout: UserLayout) => void; // optional callback for saving layout
}

export default function LayoutRenderer({ layout, contextProps, onLayoutChange }: LayoutRendererProps) {
  const [items, setItems] = useState<LayoutItem[]>(layout.items);

  useEffect(() => {
    setItems(layout.items);
  }, [layout.items]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);

    setItems(newItems);

    if (onLayoutChange) {
      onLayoutChange({ items: newItems });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dashboard" direction="vertical">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
            {items.map((item, index) => {
              const WidgetComponent = WIDGETS[item.widget]?.component;
              if (!WidgetComponent) return null;

              return (
                <Draggable key={item.widget} draggableId={item.widget} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <WidgetComponent {...contextProps} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
