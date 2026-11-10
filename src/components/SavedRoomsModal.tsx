import React from 'react';
import { X, Trash2, ArrowRight, Clock, Calendar } from 'lucide-react';
import { SavedRoomProject } from '../types';

interface SavedRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRooms: SavedRoomProject[];
  onSelectRoom: (project: SavedRoomProject) => void;
  onDeleteRoom: (id: string) => void;
}

export const SavedRoomsModal: React.FC<SavedRoomsModalProps> = ({
  isOpen,
  onClose,
  savedRooms,
  onSelectRoom,
  onDeleteRoom,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Saved Room Analyses ({savedRooms.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between rooms in your home and resume your progress.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedRooms.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No saved room projects yet. Scan a room to store your progress.
            </div>
          ) : (
            savedRooms.map((room) => {
              const dateStr = new Date(room.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const totalSteps = room.analysis?.actionPlan?.length || 0;
              const completedCount = room.completedStepNumbers?.length || 0;
              const percent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

              return (
                <div
                  key={room.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition-all bg-white dark:bg-slate-800/40 flex items-center gap-4 group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={room.imageSrc}
                      alt={room.roomName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onSelectRoom(room);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {room.roomName}
                      </h4>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500 capitalize">
                        {room.roomType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono tabular-nums">
                      <span>Clutter: {room.analysis?.clutterScore || 5}/10</span>
                      <span>·</span>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">
                        {percent}% completed ({completedCount}/{totalSteps})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectRoom(room);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteRoom(room.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                      title="Delete room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
