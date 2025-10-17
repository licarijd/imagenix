# Creating Imagenix.Dev Images: Complete Guide

This comprehensive guide explains how to create interactive images using Imagenix and integrate them into your applications using the `InteractiveImageRenderer` component.

## Table of Contents

1. [Overview](#overview)
2. [Creating an Interactive Image](#creating-an-interactive-image)
3. [Understanding the JSON Structure](#understanding-the-json-structure)
4. [Using InteractiveImageRenderer](#using-interactiveimagerenderer)
5. [Complete Code Examples](#complete-code-examples)
6. [Best Practices](#best-practices)

## Overview

Imagenix.Dev allows you to transform static images into interactive experiences by adding clickable areas and hover effects. The process involves:

1. **Creating**: Upload an image to [https://imagenix.dev/editor](https://imagenix.dev/editor) and draw interactive areas
2. **Exporting**: Download the JSON configuration file
3. **Integrating**: Use the `InteractiveImageRenderer` component in your application

## Creating an Interactive Image

### Step 1: Access the Editor
Visit [https://imagenix.dev/editor](https://imagenix.dev/editor) and sign in with your Google account.

### Step 2: Upload Your Image
1. Click "Upload Image" and select your image file
2. The image will be displayed in the editor canvas
3. Ensure your image is high-quality and well-lit for best results

### Step 3: Draw Interactive Areas
1. **Select Drawing Mode**: Choose between "Polygon" or "Ellipse" drawing modes
2. **Create Groups**: Name your interactive areas (e.g., "hood", "windows", "wheels")
3. **Draw Shapes**: 
   - **Polygons**: Click to create points that form complex shapes
   - **Ellipses**: Click and drag to create circular or oval areas
4. **Set Colors**: Define default and active colors for each group

### Step 4: Export Your Configuration
1. Click the "Export" button
2. Download the JSON file containing your interactive image configuration

## Understanding the JSON Structure

The exported JSON contains all the data needed to recreate your interactive image. Here's the structure:

```typescript
interface ImageDataType {
  size: {
    x: number;  // Original image width
    y: number;  // Original image height
  };
  shapes: {
    [groupName: string]: {
      nodes: Array<{
        points: Array<{
          x: number;
          y: number;
          curve: "curveLinear";
        }>;
        id: string;
        group: string;
        colourSchema?: {
          default: string;
          active: string;
        };
      }>;
      colourSchema: {
        default: string;
        active: string;
      };
    };
  };
  ellipses: {
    [groupName: string]: {
      nodes: Array<{
        cx: number;
        cy: number;
        rx: number;
        ry: number;
        fill: string;
        rotation: number;
        id: string;
        group: string;
      }>;
      colourSchema: {
        default: string;
        active: string;
      };
    };
  };
}
```

### Example JSON Structure (Car Data)

```json
{
  "size": {
    "x": 1400,
    "y": 800
  },
  "shapes": {
    "hood": {
      "nodes": [
        {
          "points": [
            {
              "x": 476.53125,
              "y": 447.42578125,
              "curve": "curveLinear"
            }
            // ... more points
          ],
          "id": "hood-",
          "group": "hood"
        }
      ],
      "colourSchema": {
        "default": "blue",
        "active": "blue"
      }
    }
  },
  "ellipses": {
    "wheels": {
      "nodes": [
        {
          "cx": 921.03125,
          "cy": 461.17578125,
          "rx": 62,
          "ry": 125,
          "fill": "rgba(100, 150, 255, 0.5)",
          "rotation": -0.022428348587675506,
          "id": "wheels-1",
          "group": "wheels"
        }
      ],
      "colourSchema": {
        "default": "blue",
        "active": "blue"
      }
    }
  }
}
```

## Using InteractiveImageRenderer

The `InteractiveImageRenderer` component is the core component for displaying interactive images in your React applications.

### Installation

```bash
npm install @imagenix/imagenix-web
```

### Basic Usage

```tsx
import React, { useState, useMemo } from 'react';
import { InteractiveImageRenderer } from '@imagenix/imagenix-web';
import { imageDataType } from '@imagenix/imagenix-web';

interface InteractiveImageProps {
  imageUrl: string;
  imageData: imageDataType;
  width: number; // image height will be set based on the original ratio
}

const MyInteractiveImage: React.FC<InteractiveImageProps> = ({
  imageUrl,
  imageData,
  width,
  descriptions
}) => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Create event handlers for each interactive area
  const eventHandlerMap = useMemo(() => {
    const shapes = {};
    const ellipses = {};

    // Get all group names from the image data
    const groups = [
      ...Object.keys(imageData?.shapes || {}),
      ...Object.keys(imageData?.ellipses || {})
    ];

    groups.forEach(group => {
      const handlers = {
        handleClick: (event: React.MouseEvent) => {
          console.log('Clicked on:', group);
          setActiveGroup(group);
        },
        handleMouseEnter: (event: React.MouseEvent) => {
          console.log('Hovered over:', group);
        },
        handleMouseLeave: (event: React.MouseEvent) => {
          console.log('Left:', group);
        }
      };

      // Assign handlers to the correct container (shapes or ellipses)
      if (imageData?.shapes?.[group]) {
        (shapes as Record<string, unknown>)[group] = handlers;
      } else if (imageData?.ellipses?.[group]) {
        (ellipses as Record<string, unknown>)[group] = handlers;
      }
    });

    return { shapes, ellipses };
  }, [imageData]);

  const ariaLabelMap = useMemo(() => {
    const ariaLabels: Record<string, string> = {};
    Object.entries(descriptions).forEach(([key, description]) => {
      if (description) {
        ariaLabels[key] = description;
      }
    });
    return ariaLabels;
  }, [descriptions]);

  return (
    <div className="interactive-image-container">
      <InteractiveImageRenderer
        frameKey="my-interactive-image"
        imageUrl={imageUrl}
        imageData={imageData}
        eventHandlerMap={eventHandlerMap}
        activeGroup={activeGroup}
        width={width}
        ariaLabelMap={ariaLabelMap}
      />
      
      {/* Optional: Display active group information */}
      {activeGroup && (
        <div className="group-info">
          <p>Currently selected: {activeGroup}</p>
        </div>
      )}
    </div>
  );
};

export default MyInteractiveImage;
```

### Component Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `frameKey` | `string` | Unique identifier for the component instance | ✅ |
| `imageUrl` | `string` | URL of the original image | ✅ |
| `imageData` | `imageDataType` | JSON configuration from Imagenix editor | ✅ |
| `eventHandlerMap` | `EventHandlerMap` | Object containing click/hover handlers | ✅ |
| `activeGroup` | `string \| null` | Currently active/selected group | ✅ |
| `width` | `number` | The width of the display image (this is used to auto-calculate and set the height of the display image, based on the original aspect ration) | ✅ |
| `ariaLabelMap` | `{ [key: string]: string }` | Object mapping group names to accessibility labels for screen readers | ❌ |

### Accessibility with ariaLabelMap

The `ariaLabelMap` prop provides accessibility labels for interactive areas, making your interactive images accessible to users with screen readers and other assistive technologies.

**Usage:**
```tsx
const ariaLabelMap = {
  'hood': 'Car hood - click to learn about the engine compartment',
  'windows': 'Car windows - click to learn about glass features',
  'wheels': 'Car wheels - click to learn about tire specifications'
};

<InteractiveImageRenderer
  // ... other props
  ariaLabelMap={ariaLabelMap}
/>
```

**Best Practices:**
- Use descriptive, actionable language
- Keep labels concise but informative
- Include the action users can take (e.g., "click to learn more")
- Map each group name from your image data to a meaningful description
- Test with screen readers to ensure clarity

## Complete Code Examples

### Example 1: Car Interactive Image

```tsx
import React, { useState, useMemo } from 'react';
import { InteractiveImageRenderer } from '@imagenix/imagenix-web';
import { imageDataType } from '@imagenix/imagenix-web';
import { carData } from './data/car';

const CarInteractiveDemo: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [previewGroup, setPreviewGroup] = useState<string | null>('hood');

  // Parse the car data
  const imageData = JSON.parse(carData);

  // This MUST be the same image that you used in the editor!
  const imageUrl = "https://example.com/car-image.jpg";
  const groups = ['hood', 'windows', 'wheels'];
  
  const width = 700

  const eventHandlerMap = useMemo(() => {
    const shapes = {};
    const ellipses = {};

    groups.forEach(group => {
      const handlers = {
        handleClick: (event: React.MouseEvent) => {
          console.log('Car part clicked:', group);
          setActiveGroup(group);
        },
        handleMouseEnter: (event: React.MouseEvent) => {
          console.log('Hovering over:', group);
          setPreviewGroup(group);
        },
        handleMouseLeave: (event: React.MouseEvent) => {
          console.log('Left:', group);
          setPreviewGroup(null);
        }
      };

      if (imageData?.shapes?.[group]) {
        (shapes as Record<string, unknown>)[group] = handlers;
      } else if (imageData?.ellipses?.[group]) {
        (ellipses as Record<string, unknown>)[group] = handlers;
      }
    });

    return { shapes, ellipses };
  }, [imageData, groups]);

  const getGroupDescription = (group: string) => {
    const descriptions = {
      hood: "The car hood is made from lightweight aluminum alloy with aerodynamic design.",
      windows: "Premium tempered glass windows with UV protection and anti-glare coating.",
      wheels: "High-performance alloy wheels with advanced traction control system."
    };
    return descriptions[group as keyof typeof descriptions] || 'No description available.';
  };

  // Create accessibility labels for screen readers
  const ariaLabelMap = useMemo(() => {
    const descriptions = {
      hood: "Car hood - click to learn about the engine compartment and aluminum construction",
      windows: "Car windows - click to learn about premium glass features and UV protection",
      wheels: "Car wheels - click to learn about high-performance alloy wheels and traction control"
    };
    return descriptions;
  }, []);

  return (
    <div className="car-demo">
      <h2>Interactive Car Demo</h2>
      
      <div className="image-container">
        <InteractiveImageRenderer
          frameKey="car-demo"
          imageUrl={imageUrl}
          imageData={imageData}
          eventHandlerMap={eventHandlerMap}
          activeGroup={activeGroup ?? previewGroup}
          ariaLabelMap={ariaLabelMap}
          width={width}
        />
      </div>

      <div className="info-panel">
        <h3>Car Information</h3>
        <p>
          {activeGroup 
            ? getGroupDescription(activeGroup)
            : "Hover over different parts of the car to learn more about each component."
          }
        </p>
        
        {activeGroup && (
          <button onClick={() => setActiveGroup(null)}>
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
};

export default CarInteractiveDemo;
```

### Example 2: Refrigerator Interactive Image

```tsx
import React, { useState, useMemo } from 'react';
import { InteractiveImageRenderer } from '@imagenix/imagenix-web';
import { imageDataType } from '@imagenix/imagenix-web';
import { refrigeratorData } from './data/refrigerator';

const RefrigeratorInteractiveDemo: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const imageData = JSON.parse(refrigeratorData);

  // This MUST be the same image that you used in the editor!
  const imageUrl = "https://example.com/refrigerator-image.jpg";
  const groups = ['door', 'top-screen', 'bottom-screen', 'shelves'];
  
  const width = 700

  const eventHandlerMap = useMemo(() => {
    const shapes = {};
    const ellipses = {};

    groups.forEach(group => {
      const handlers = {
        handleClick: (event: React.MouseEvent) => {
          console.log('Refrigerator component clicked:', group);
          setActiveGroup(activeGroup === group ? null : group);
        },
        handleMouseEnter: (event: React.MouseEvent) => {
          console.log('Hovering over refrigerator component:', group);
        },
        handleMouseLeave: (event: React.MouseEvent) => {
          console.log('Left refrigerator component:', group);
        }
      };

      if (imageData?.shapes?.[group]) {
        (shapes as Record<string, unknown>)[group] = handlers;
      }
    });

    return { shapes, ellipses };
  }, [imageData, groups, activeGroup]);

  const getComponentInfo = (group: string) => {
    const info = {
      door: {
        title: "Smart Door",
        description: "Energy-efficient door with LED lighting and temperature control.",
        features: ["LED Lighting", "Temperature Control", "Energy Efficient"]
      },
      'top-screen': {
        title: "Control Panel",
        description: "Touchscreen interface for controlling refrigerator settings.",
        features: ["Touchscreen", "Temperature Display", "Weather Info"]
      },
      'bottom-screen': {
        title: "Food Management",
        description: "Smart display for food inventory and recommendations.",
        features: ["Food Tracking", "Expiry Alerts", "Recipe Suggestions"]
      },
      shelves: {
        title: "Adjustable Shelves",
        description: "Flexible storage with optimal organization features.",
        features: ["Adjustable Height", "Easy Cleaning", "Optimal Organization"]
      }
    };
    return info[group as keyof typeof info] || null;
  };

  const currentInfo = activeGroup ? getComponentInfo(activeGroup) : null;

  // Create accessibility labels for screen readers
  const ariaLabelMap = useMemo(() => {
    return {
      'door': 'Smart refrigerator door - click to learn about LED lighting and temperature control',
      'top-screen': 'Control panel - click to learn about touchscreen interface and settings',
      'bottom-screen': 'Food management display - click to learn about inventory tracking and recommendations',
      'shelves': 'Adjustable shelves - click to learn about flexible storage options'
    };
  }, []);

  return (
    <div className="refrigerator-demo">
      <h2>Smart Refrigerator Demo</h2>
      
      <div className="demo-layout">
        <div className="image-container">
          <InteractiveImageRenderer
            frameKey="refrigerator-demo"
            imageUrl={imageUrl}
            imageData={imageData}
            eventHandlerMap={eventHandlerMap}
            activeGroup={activeGroup}
            width={width}
            ariaLabelMap={ariaLabelMap}
          />
        </div>

        <div className="details-panel">
          {currentInfo ? (
            <div className="component-details">
              <h3>{currentInfo.title}</h3>
              <p>{currentInfo.description}</p>
              
              <h4>Features:</h4>
              <ul>
                {currentInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="welcome-message">
              <h3>Welcome to Smart Refrigerator</h3>
              <p>Click on any component to learn more about its features and capabilities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefrigeratorInteractiveDemo;
```

### Example 3: Floor Plan Interactive Image

```tsx
import React, { useState, useMemo } from 'react';
import { InteractiveImageRenderer } from '@imagenix/imagenix-web';
import { imageDataType } from '@imagenix/imagenix-web';
import { floorPlan } from './data/floorPlan';

const FloorPlanInteractiveDemo: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const imageData = floorPlan;

  // This MUST be the same image that you used in the editor!
  const imageUrl = "https://example.com/floor-plan.jpg";
  const groups = ['bathrooms', 'bedrooms'];
  
  const width = 875

  const eventHandlerMap = useMemo(() => {
    const shapes = {};
    const ellipses = {};

    groups.forEach(group => {
      const handlers = {
        handleClick: (event: React.MouseEvent) => {
          console.log('Room clicked:', group);
          setActiveGroup(activeGroup === group ? null : group);
        },
        handleMouseEnter: (event: React.MouseEvent) => {
          console.log('Hovering over room:', group);
          setHoveredGroup(group);
        },
        handleMouseLeave: (event: React.MouseEvent) => {
          console.log('Left room:', group);
          setHoveredGroup(null);
        }
      };

      if (imageData?.shapes?.[group]) {
        (shapes as Record<string, unknown>)[group] = handlers;
      }
    });

    return { shapes, ellipses };
  }, [imageData, groups, activeGroup]);

  const getRoomInfo = (group: string) => {
    const roomInfo = {
      bathrooms: {
        count: 3,
        totalArea: "45 sq ft",
        features: ["Modern fixtures", "Ventilation", "Storage"]
      },
      bedrooms: {
        count: 4,
        totalArea: "120 sq ft",
        features: ["Walk-in closets", "Natural lighting", "Private access"]
      }
    };
    return roomInfo[group as keyof typeof roomInfo] || null;
  };

  const currentInfo = activeGroup ? getRoomInfo(activeGroup) : null;
  const hoveredInfo = hoveredGroup ? getRoomInfo(hoveredGroup) : null;

  // Create accessibility labels for screen readers
  const ariaLabelMap = useMemo(() => {
    return {
      'bathrooms': 'Bathrooms - click to learn about bathroom features and specifications',
      'bedrooms': 'Bedrooms - click to learn about bedroom features and specifications'
    };
  }, []);

  return (
    <div className="floor-plan-demo">
      <h2>Interactive Floor Plan</h2>
      
      <div className="demo-layout">
        <div className="image-container">
          <InteractiveImageRenderer
            frameKey="floor-plan-demo"
            imageUrl={imageUrl}
            imageData={imageData}
            eventHandlerMap={eventHandlerMap}
            activeGroup={activeGroup}
            width={width}
            ariaLabelMap={ariaLabelMap}
          />
        </div>

        <div className="info-panel">
          <div className="room-stats">
            <h3>Room Statistics</h3>
            {currentInfo ? (
              <div className="selected-room">
                <h4>{activeGroup?.charAt(0).toUpperCase() + activeGroup?.slice(1)}</h4>
                <p>Count: {currentInfo.count}</p>
                <p>Total Area: {currentInfo.totalArea}</p>
                <div className="features">
                  <h5>Features:</h5>
                  <ul>
                    {currentInfo.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : hoveredInfo ? (
              <div className="hovered-room">
                <h4>Hovering: {hoveredGroup?.charAt(0).toUpperCase() + hoveredGroup?.slice(1)}</h4>
                <p>Count: {hoveredInfo.count}</p>
                <p>Total Area: {hoveredInfo.totalArea}</p>
              </div>
            ) : (
              <p>Hover over or click on rooms to see details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanInteractiveDemo;
```

## Best Practices

### 1. You MUST render the same image with InteractiveImageRenderer that you used in the editor. If you edit your original image, then just create a new
interactive image for that image.

### 2. Optimize Event Handlers
Use `useMemo` to prevent unnecessary re-renders:

```tsx
const eventHandlerMap = useMemo(() => {
  // Create handlers
}, [imageData, activeGroup]); // Only recreate when dependencies change
```

### 3. Handle Loading States
```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const img = new Image();
  img.onload = () => setIsLoading(false);
  img.src = imageUrl;
}, [imageUrl]);

if (isLoading) {
  return <div>Loading interactive image...</div>;
}
```

### 4. Provide User Feedback
```tsx
const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

// In your event handlers
handleMouseEnter: () => {
  setHoveredGroup(group);
  // Optional: Show tooltip or highlight
},
handleMouseLeave: () => {
  setHoveredGroup(null);
  // Optional: Hide tooltip
}
```

### 5. Error Handling
```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  try {
    const parsedData = JSON.parse(imageDataJson);
    // Validate the structure
    if (!parsedData.size || !parsedData.shapes || !parsedData.ellipses) {
      throw new Error('Invalid image data structure');
    }
  } catch (err) {
    setError('Failed to load image data');
  }
}, [imageDataJson]);

if (error) {
  return <div className="error">Error: {error}</div>;
}
```

### 6. Responsive Design
```tsx
const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

useEffect(() => {
  const updateSize = () => {
    const container = containerRef.current;
    if (container) {
      const { width } = container.getBoundingClientRect();
      const height = width / originalRatio;
      setContainerSize({ width, height });
    }
  };

  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, [originalRatio]);
```

## Conclusion

The Imagenix.Dev platform makes it easy to create interactive images that enhance user engagement. By following this guide and using the provided code examples, you can:

1. Create interactive images in the Imagenix.Dev editor
2. Export the configuration JSON
3. Integrate them into your React applications
4. Handle user interactions with custom event handlers
5. Maintain proper aspect ratios and responsive design

For more advanced features and customization options, refer to the [Imagenix documentation](https://imagenix.dev) or explore the component source code.
