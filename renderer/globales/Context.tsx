import React, { createContext, useContext, useState } from "react";

// Création du contexte

export const ObjectContext = createContext<{
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}>({} as any);

// Hook personnalisé pour accéder au contexte et à l'objet
export const useConfig = () => {
  return useContext(ObjectContext);
};
