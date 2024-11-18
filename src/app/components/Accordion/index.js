"use client";
import React, { createContext, useState, useContext, useId } from 'react';

const AccordionContext = createContext();

const Accordion = ({ children }) => {
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panelId) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  return (
    <AccordionContext.Provider value={{ activePanel, togglePanel }}>
      <div 
        role="region" 
        aria-label="Accordion" 
        className="w-full max-w-2xl mx-auto space-y-2"
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ children }) => {
  const panelId = useId();
  const { activePanel, togglePanel } = useContext(AccordionContext);
  const isOpen = activePanel === panelId;

  return (
    <div 
      role="group" 
      className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300"
    >
      {React.Children.map(children, child => {
        if (child.type === AccordionHeader) {
          return React.cloneElement(child, { 
            isOpen, 
            onClick: () => togglePanel(panelId),
            panelId 
          });
        }
        if (child.type === AccordionPanel) {
          return React.cloneElement(child, { 
            isOpen, 
            panelId 
          });
        }
        return child;
      })}
    </div>
  );
};

const AccordionHeader = ({ 
  children, 
  isOpen = false, 
  onClick = () => {}, 
  panelId = '' 
}) => (
  <h3 
    className={`
      bg-gray-50 
      border-b 
      border-gray-200 
      ${isOpen ? 'bg-gray-100' : 'hover:bg-gray-100'}
    `}
  >
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={onClick}
      className="
        w-full 
        text-left 
        px-4 
        py-3 
        text-gray-800
        font-medium 
        outline-none
        flex 
        justify-between 
        items-center 
        focus:outline-none 
        focus:ring-2 
        focus:ring-indigo-500
      "
    >
      <span>{children}</span>
      <span 
        aria-hidden="true" 
        className="
          text-gray-500 
          text-xl 
          font-light 
          transition-transform 
          duration-300 
          transform 
          rotate-0
        "
      >
        {isOpen ? '−' : '+'}
      </span>
    </button>
  </h3>
);

const AccordionPanel = ({ 
  children, 
  isOpen = false, 
  panelId = '' 
}) => (
  isOpen && (
    <div
      id={panelId}
      role="region"
      aria-hidden={!isOpen}
      className="
        px-4 
        py-3 
        text-gray-600 
        bg-white 
        transition-all 
        duration-300 
        ease-in-out
      "
    >
      {children}
    </div>
  )
);

export default function AccordionDemo() {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionHeader>Informations Personnelles</AccordionHeader>
        <AccordionPanel>
          <p>Je suis un développeur web</p>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>Compétences</AccordionHeader>
        <AccordionPanel>
          <p>J'aime utiliser Next.js et Tailwind CSS</p>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export { Accordion, AccordionItem, AccordionHeader, AccordionPanel };