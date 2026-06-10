import { createContext, useContext } from 'react'

/** True when content is being rendered for print/PDF (the PrintView stacks all tabs). */
export const PrintModeContext = createContext(false)
export const usePrintMode = () => useContext(PrintModeContext)
