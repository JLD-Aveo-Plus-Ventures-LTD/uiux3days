/**
 * useModal Hook
 * 
 * Custom hook for managing modal open/closed state
 * Provides a clean, reusable pattern for any component that needs a modal
 * 
 * @returns {object} - {isOpen, onOpen, onClose, toggle, setIsOpen}
 * 
 * @example
 * const { isOpen, onOpen, onClose } = useModal();
 * 
 * return (
 *   <>
 *     <button onClick={onOpen}>Open Modal</button>
 *     <Modal isOpen={isOpen} onClose={onClose}>
 *       Content here
 *     </Modal>
 *   </>
 * );
 */

import { useState } from "react";

function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    onOpen,
    onClose,
    toggle,
    setIsOpen, // For programmatic control if needed
  };
}

export default useModal;
