
import React, { useState } from 'react';
import { Task, ImpactTier } from '../types';
import { TrashIcon, PencilIcon, CheckCircleIcon, BellIcon, GripVerticalIcon, HandRaisedIcon } from './icons';
import { motion, PanInfo, useAnimation, AnimatePresence, DragControls } from 'framer-motion';
import { triggerHaptic } from '../utils/haptics';
import { Modal } from './Modal';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleAvoided: (id: string) => void;
  isAvoidedToday: boolean;
  dragControls?: DragControls;
}

const tierColorMap: { [key in ImpactTier]: string } = {
  [ImpactTier.LOW]: 'bg-accent-mint/20 text-accent-mint',
  [ImpactTier.MEDIUM]: 'bg-accent-yellow/20 text-accent-yellow',
  [ImpactTier.HIGH]: 'bg-danger/20 text-danger',
};

// Helper component for the explosion effect
const ConfettiBurst: React.FC = () => {
  const particleCount = 12;
  return (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * 360;
        const radius = 24; // Distance to travel
        return (
          <motion.span
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-success' : 'bg-accent-yellow'}`}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [1, 0.5, 0], // Grow then shrink
              x: Math.cos((angle * Math.PI) / 180) * radius,
              y: Math.sin((angle * Math.PI) / 180) * radius,
              opacity: [1, 0.8, 0],
            }}
            transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                times: [0, 0.7, 1] 
            }}
          />
        );
      })}
    </span>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit, onToggleAvoided, isAvoidedToday, dragControls }) => {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  
  const emojis = ["🔥", "✨", "🛡️", "💪", "🚀", "🎉", "💯", "🚫", "🙅‍♂️", "🧘"];
  const [currentEmoji, setCurrentEmoji] = useState(emojis[0]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Swipe Left to Delete (Threshold: -100px or fast swipe)
    if (offset < -100 || (offset < -50 && velocity < -500)) {
       triggerHaptic(50); // Stronger haptic for delete
       await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
       onDelete(task.id);
    } else {
       controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleDragStart = () => {
      setIsDragging(true);
      triggerHaptic(5); // Tiny haptic on pick up
  };

  const handleCheck = (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic(15);
      if (!isAvoidedToday) {
         setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      }
      onToggleAvoided(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic(25); // Medium haptic for edit action
      onEdit(task);
  };
  
  const handleContentClick = () => {
      if (!isDragging) {
          setShowStopModal(true);
          triggerHaptic(10);
      }
  };

  return (
    <>
        <div className="relative mb-4 group">
        {/* Background layer for Swipe Action (Trash) */}
        <div className="absolute inset-0 bg-danger rounded-lg flex items-center justify-end pr-6 z-0">
            <TrashIcon className="w-6 h-6 text-white" />
        </div>

        {/* Foreground Card */}
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} // Elastic constraints
            dragElastic={{ right: 0.05, left: 0.2 }} // Stiffer (0.2) to prevent accidental deletes
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ x: 0, opacity: 1 }}
            whileTap={{ cursor: "grabbing" }}
            className="relative z-10 bg-white dark:bg-bg-dark-secondary rounded-lg shadow-sm p-4 flex items-start cursor-grab touch-pan-y border border-transparent dark:border-gray-700 active:shadow-md transition-shadow"
            style={{ touchAction: "pan-y" }}
        >
            {/* Drag Handle for Reordering */}
            {dragControls && (
                <div 
                    className="mr-3 mt-1.5 cursor-grab touch-none text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
                    onPointerDown={(e) => {
                        triggerHaptic(10);
                        dragControls.start(e);
                    }}
                >
                    <GripVerticalIcon className="w-5 h-5" />
                </div>
            )}

            <div className="relative mt-1 mr-4">
            <motion.button
                onClick={handleCheck}
                whileTap={{ scale: 0.85 }}
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isAvoidedToday ? 'bg-success text-white border-transparent' : 'border-2 border-gray-300 dark:border-gray-600 bg-transparent'
                }`}
                aria-label={isAvoidedToday ? `Mark ${task.name} as not avoided` : `Mark ${task.name} as avoided`}
            >
                <AnimatePresence>
                {isAvoidedToday && (
                    <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1.2, rotate: 0, opacity: 1 }} // Slight overshoot
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                    <CheckCircleIcon className="w-5 h-5" />
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.button>
            
            {/* Confetti Effect Rendered Behind/Around Button */}
            <AnimatePresence>
                {isAvoidedToday && <ConfettiBurst />}
            </AnimatePresence>

            {/* Emoji Pop Animation */}
            <AnimatePresence>
                {isAvoidedToday && (
                <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: -40, 
                        scale: [0.5, 1.2, 1] 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 text-2xl pointer-events-none"
                >
                    {currentEmoji}
                </motion.div>
                )}
            </AnimatePresence>
            </div>

            <div className="flex-1 min-w-0" onClick={handleContentClick} role="button" tabIndex={0}>
                <div className="flex items-center justify-between">
                    {/* Bounce Animation on Task Name */}
                    <motion.h3 
                        layout
                        animate={isAvoidedToday ? { y: [0, -3, 0], color: "#94a3b8" } : { y: 0, color: "inherit" }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className={`text-lg font-semibold truncate transition-all duration-300 ${
                            isAvoidedToday 
                                ? 'line-through decoration-2 decoration-gray-300 dark:decoration-gray-600' 
                                : 'text-gray-800 dark:text-white'
                        }`}
                    >
                        {task.name}
                    </motion.h3>
                </div>
                
                {task.description && (
                    <p className={`text-sm mt-0.5 truncate transition-colors duration-300 ${
                        isAvoidedToday 
                            ? 'text-gray-300 dark:text-gray-600' 
                            : 'text-muted-light dark:text-muted-dark'
                    }`}>
                        {task.description}
                    </p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColorMap[task.tier]}`}>
                        {task.tier} Impact
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
                        {task.category}
                    </span>
                    {task.reminderInterval && task.reminderInterval > 0 && (
                        <span className="flex items-center text-xs text-primary-light dark:text-primary-dark font-medium bg-primary-light/10 dark:bg-primary-dark/10 px-2 py-0.5 rounded-full">
                            <BellIcon className="w-3 h-3 mr-1" />
                            {task.reminderInterval < 60 ? `${task.reminderInterval}m` : `${task.reminderInterval/60}h`}
                        </span>
                    )}
                </div>
            </div>

            <button 
                onClick={handleEdit} 
                className="ml-2 p-2 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                aria-label="Edit task"
            >
                <PencilIcon className="w-5 h-5" />
            </button>

        </motion.div>
        </div>

        {/* The "Don't Do" Reminder Modal */}
        <Modal 
            isOpen={showStopModal} 
            onClose={() => setShowStopModal(false)} 
            title="Wait!"
        >
            <div className="flex flex-col items-center text-center pb-2">
                <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
                >
                     <HandRaisedIcon className="w-12 h-12 text-danger" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Don't Do This
                </h3>
                
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 w-full mb-6 border border-gray-100 dark:border-gray-700">
                    <p className="text-xl font-bold text-primary-light dark:text-primary-dark mb-1">
                        {task.name}
                    </p>
                    {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            "{task.description}"
                        </p>
                    )}
                </div>

                <p className="text-muted-light dark:text-muted-dark mb-8">
                    Remember why you want to avoid this. Take a deep breath and redirect your focus.
                </p>

                <button 
                    onClick={() => setShowStopModal(false)} 
                    className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gray-800 dark:bg-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                >
                    I Won't Do It
                </button>
            </div>
        </Modal>
    </>
  );
};
