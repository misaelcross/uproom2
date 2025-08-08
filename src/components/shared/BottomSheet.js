import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Zap } from 'lucide-react';

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title = "Nudges", 
  children,
  maxWidth = "300px",
  maxHeight = "60vh",
  badgeCount = 1
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Bottom Sheet Container */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="flex min-h-full items-end justify-end p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel 
                className="pointer-events-auto relative transform overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl transition-all border border-neutral-700"
                style={{ 
                  maxWidth: maxWidth,
                  maxHeight: maxHeight,
                  minWidth: "200px"
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    {/* Icon with Badge */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      {badgeCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{badgeCount}</span>
                        </div>
                      )}
                    </div>
                    
                    <Dialog.Title className="text-lg font-medium text-white">
                      {title}
                    </Dialog.Title>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                     <button
                       type="button"
                       className="p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                       onClick={onClose}
                     >
                       <X className="h-5 w-5" />
                     </button>
                   </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 80px)` }}>
                  {children}
                </div>

                {/* Drag Handle (visual indicator) */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BottomSheet;