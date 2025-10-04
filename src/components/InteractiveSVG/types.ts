import { EllipseType } from '@imagenix/imagenix-core/dist/components/Ellipse/types';
import { ColourSchema, Polygon } from '@imagenix/imagenix-core/dist';

export type imageDataType = {
  scale: {
    x: number;
    y: number;
  },
  size: {
    x: number;
    y: number;
  },
  shapes?: { [group: string]: { nodes: Polygon[], colourSchema: ColourSchema } };
  ellipses?: { [group: string]: { nodes: EllipseType[], colourSchema: ColourSchema } };
}
