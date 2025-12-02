import { useState } from 'react';
import type { ComponentConfig } from '../../types/layout';

interface DraggableListProps<T extends ComponentConfig> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  onToggle: (id: string, enabled: boolean) => void;
  renderItem?: (item: T) => React.ReactNode;
}

export function DraggableList<T extends ComponentConfig>({
  items,
  onReorder,
  onToggle,
  renderItem,
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    // order 재설정
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    })) as T[];

    onReorder(reorderedItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            flex items-center gap-3 p-3 bg-white border rounded-lg cursor-move transition-all
            ${draggedIndex === index ? 'opacity-50' : ''}
            ${dragOverIndex === index ? 'border-blue-500 border-2' : 'border-gray-300'}
            hover:shadow-md
          `}
        >
          {/* 드래그 핸들 */}
          <div className="flex-shrink-0 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          {/* ON/OFF 토글 */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* 컨텐츠 */}
          <div className="flex-1">
            {renderItem ? (
              renderItem(item)
            ) : (
              <div className="flex items-center gap-2">
                <span className={item.enabled ? 'text-gray-900' : 'text-gray-400'}>
                  {item.label || item.id}
                </span>
                {!item.enabled && (
                  <span className="text-xs text-gray-400">(비활성)</span>
                )}
              </div>
            )}
          </div>

          {/* 순서 표시 */}
          <div className="flex-shrink-0 text-sm text-gray-500 font-medium">
            #{item.order}
          </div>
        </div>
      ))}
    </div>
  );
}
