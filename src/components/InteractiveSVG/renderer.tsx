import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { PresentationalEllipse } from '@imagenix/imagenix-core/dist/components/Ellipse/Ellipse';
import { createPolygon } from '@imagenix/imagenix-core/dist/components/Polygon';
import { Polygon } from '@imagenix/imagenix-core/dist';
import { useEllipses } from '@imagenix/imagenix-core/dist';
import { usePolygons } from '@imagenix/imagenix-core/dist';
import { imageDataType } from './types';
import { InteractiveSVG } from '.';

type EventHandlers = {
  handleClick: (event: React.MouseEvent) => void;
  handleMouseMove?: (event: React.MouseEvent) => void;
  handleSelect?: (event: React.SyntheticEvent) => void;
  handleMouseUp?: (event: React.MouseEvent) => void;
}

interface InteractiveImageRendererProps {
  imageData: imageDataType;
  imageUrl: string;
  eventHandlerMap: { shapes: { [key: string]: EventHandlers; }; ellipses: { [key: string]: EventHandlers; } };
  activeGroup: string | null;
  width: number;
  frameKey: string
}

export const InteractiveImageRenderer: React.FC<InteractiveImageRendererProps> = ({ frameKey, imageData, imageUrl, eventHandlerMap, activeGroup, width }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const {
    ellipses,
    setEllipses,
  } = useEllipses();
  const {
    setPoints,
    setShapes,
    curveType
  } = usePolygons({ svgRef });
  const hasDrawnShapes = useRef(false);

  const parsedImageData: imageDataType = useMemo(() => imageData, [imageData]);

  const ratio = useMemo(() => width / parsedImageData.size?.x, [width, parsedImageData.size?.x]);

  const handleDrawShapes = useCallback((shapes: Polygon[]) => {
    for (const shape of shapes) {
      createPolygon({
        svgRef,
        points: shape.points,
        setPoints,
        shapes,
        setShapes,
        id: shape.id,
        group: shape.group,
        curveType,
        colourSchema: shape.colourSchema ?? { default: 'lightgreen', active: 'orange' },
        eventHandlers: eventHandlerMap.shapes[shape.group],
      });
    }
  }, [svgRef, setPoints, setShapes, curveType, eventHandlerMap.shapes]);

  // draw the shapes and ellipses when they are loaded into the tool
  useEffect(() => {
    if (hasDrawnShapes.current) return;
    for (const group in parsedImageData.shapes) {
      handleDrawShapes(parsedImageData.shapes[group].nodes);
    }
    for (const group in parsedImageData.ellipses) {
      setEllipses([...ellipses, ...parsedImageData.ellipses[group].nodes]);
    }

    const svg = d3.select(svgRef.current);
    const scaleX = ratio;
    const scaleY = ratio;

    svg.select('g')
      .attr("transform", `scale(${scaleX}, ${scaleY})`);

    hasDrawnShapes.current = true;
  }, [parsedImageData, svgRef, setEllipses, setShapes, setPoints, handleDrawShapes, ellipses, width, ratio]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const defs = svg.append("defs");

    defs.append("filter")
      .attr("id", "blur")
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", 3); // control blur strength
  }, [svgRef]);
  
  // Polygons are not a React component, so we need to manually change the color and call the handleClick handler
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
      
    svg.selectAll('path')
    .transition()
      .duration(500)
      .attr('tabindex', 0)
      .attr('fill', function() {
        const id = d3.select(this).attr('id');
        const group = parsedImageData?.shapes?.[activeGroup ?? ''];

        if (!group) return 'blue';
        
        return id?.includes(activeGroup ?? '') ? group.colourSchema.active : group.colourSchema.default;
      })
      .attr('opacity', function() {
        const id = d3.select(this).attr('id');
        const group = parsedImageData?.shapes?.[activeGroup ?? ''];

        if (!group) return 0.01;

        return id?.includes(activeGroup ?? '') ? 0.20 : 0.01;
      })
      .style("filter", "url(#blur)");
  }, [activeGroup, parsedImageData, svgRef]);

  return (
    <InteractiveSVG
      frameKey={frameKey}
      svgRef={svgRef}
      x={width}
      y={ratio * parsedImageData.size?.y}
      imageUrl={imageUrl}
    >
    {/* Render existing ellipses */}
    {ellipses.map((ellipse, index) => (
      <PresentationalEllipse
        key={index}
        index={index}
        ellipse={{...ellipse}}
        colourSchema={parsedImageData.ellipses?.[ellipse.group].colourSchema ?? { default: 'blue', active: 'blue' }}
        activeGroup={activeGroup}
        eventHandlers={eventHandlerMap.ellipses[ellipse.group]}
      />
    ))}
    </InteractiveSVG>
  );
};
