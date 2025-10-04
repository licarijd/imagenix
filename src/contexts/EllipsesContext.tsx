'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { EllipseType, DraggingEllipse, ResizingEllipse, RotatingEllipse } from '@imagenix/imagenix-core/dist/components/Ellipse/types'

interface EllipsesContextType {
  ellipses: EllipseType[]
  setEllipses: React.Dispatch<React.SetStateAction<EllipseType[]>>
  draggingEllipse: DraggingEllipse | null
  setDraggingEllipse: React.Dispatch<React.SetStateAction<DraggingEllipse | null>>
  resizingEllipse: ResizingEllipse | null
  setResizingEllipse: React.Dispatch<React.SetStateAction<ResizingEllipse | null>>
  rotatingEllipse: RotatingEllipse | null
  setRotatingEllipse: React.Dispatch<React.SetStateAction<RotatingEllipse | null>>
  startPoint: [number, number] | null
  setStartPoint: React.Dispatch<React.SetStateAction<[number, number] | null>>
  currentPoint: [number, number] | null
  setCurrentPoint: React.Dispatch<React.SetStateAction<[number, number] | null>>
  handleMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void
  handleMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void
  handleMouseUp: (currentId: string, currentGroup: string) => void
}

const EllipsesContext = createContext<EllipsesContextType | undefined>(undefined)

export const useEllipsesContext = () => {
  const context = useContext(EllipsesContext)
  if (context === undefined) {
    throw new Error('useEllipsesContext must be used within an EllipsesProvider')
  }
  return context
}

interface EllipsesProviderProps {
  children: ReactNode
  value: EllipsesContextType
}

export const EllipsesProvider: React.FC<EllipsesProviderProps> = ({ children, value }) => {
  return (
    <EllipsesContext.Provider value={value}>
      {children}
    </EllipsesContext.Provider>
  )
}

export const useEllipsesContextProvider = () => {
  const context = useContext(EllipsesContext)
  if (context === undefined) {
    throw new Error('useEllipsesContextProvider must be used within an EllipsesProvider')
  }
  return context
}
