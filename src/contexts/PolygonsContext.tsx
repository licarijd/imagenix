'use client'

import React, { createContext, useContext,  ReactNode } from 'react'
import { Point, Polygon } from '@imagenix/imagenix-core/dist'

interface PolygonsContextType {
  points: Point[]
  setPoints: (points: Point[]) => void
  shapes: Polygon[]
  setShapes: (shapes: Polygon[]) => void
  handleAddNewPoint: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
  setCurveType: (curveType: 'curveLinear' | 'curveCatmullRomOpen') => void
  curveType: 'curveLinear' | 'curveCatmullRomOpen'
  lastStraightPoint: number
  lastCurvedPoint: number
  setLastStraightPoint: (lastStraightPoint: number) => void
  setLastCurvedPoint: (lastCurvedPoint: number) => void
}

const PolygonsContext = createContext<PolygonsContextType | undefined>(undefined)

export const usePolygons = () => {
  const context = useContext(PolygonsContext)
  if (context === undefined) {
    throw new Error('usePolygons must be used within a PolygonsProvider')
  }
  return context
}

interface PolygonsProviderProps {
  children: ReactNode
  value: PolygonsContextType
}

export const PolygonsProvider: React.FC<PolygonsProviderProps> = ({ children, value }) => {
  return (
    <PolygonsContext.Provider value={value}>
      {children}
    </PolygonsContext.Provider>
  )
}

export const usePolygonsContextProvider = () => {
  const context = useContext(PolygonsContext)
  if (context === undefined) {
    throw new Error('usePolygonsContextProvider must be used within a PolygonsProvider')
  }
  return context
}
