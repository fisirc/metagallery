import { createContext, useContext, useState, ReactNode } from 'react';

interface PopupContextProps {
  isRegisterPopupOpen: boolean;
  openRegisterPopup: () => void;
  closeRegisterPopup: () => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

  const openRegisterPopup = () => setIsRegisterPopupOpen(true);
  const closeRegisterPopup = () => setIsRegisterPopupOpen(false);

  return (
    <PopupContext.Provider value={{ isRegisterPopupOpen, openRegisterPopup, closeRegisterPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopupContext must be used within a PopupProvider');
  }
  return context;
};
