import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Trash2, Save, Upload } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Polygon {
  points: Point[];
  id: string;
}

/**
 * Convert polygon points to COCO segmentation format
 * COCO format: [x1, y1, x2, y2, x3, y3, ...] as a flattened array
 */
function polygonToCOCO(points: Point[]): number[] {
  const coco: number[] = [];
  points.forEach(point => {
    coco.push(Math.round(point.x));
    coco.push(Math.round(point.y));
  });
  return coco;
}

/**
 * Convert COCO format back to polygon points
 */
function cocoToPolygon(coco: number[]): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < coco.length; i += 2) {
    points.push({ x: coco[i], y: coco[i + 1] });
  }
  return points;
}

/**
 * Annotate Page - Canvas-based image annotation tool
 * Features:
 * - Draw with pen tool to create polygon annotations
 * - Save annotations as polygons
 * - Export to COCO format
 */
export default function Annotate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Redraw the entire canvas with image, grid, and polygons
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image if loaded
    if (imageRef.current && imageLoaded) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Draw white background with grid
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    // Draw all polygons
    polygons.forEach((polygon) => {
      if (polygon.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
      for (let i = 1; i < polygon.points.length; i++) {
        ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
      }

      // Fill polygon with semi-transparent color
      ctx.fillStyle = selectedPolygon === polygon.id 
        ? 'rgba(0, 136, 204, 0.3)' 
        : 'rgba(0, 136, 204, 0.2)';
      ctx.fill();

      // Draw polygon outline
      ctx.strokeStyle = selectedPolygon === polygon.id 
        ? '#0088cc' 
        : '#005577';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      polygon.points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0088cc';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    // Draw current polygon being drawn
    if (currentPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw current points
      currentPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();
      });
    }
  }, [polygons, currentPoints, selectedPolygon, imageLoaded]);

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size initially
    canvas.width = Math.min(window.innerWidth - 32, 800);
    canvas.height = Math.min(window.innerHeight - 200, 600);

    // Handle resize
    const handleResize = () => {
      if (!imageRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = Math.min(window.innerWidth - 32, 800);
        canvas.height = Math.min(window.innerHeight - 200, 600);
        redrawCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    setImageLoaded(true);
    
    // Initial redraw
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw whenever polygons, current points, selected polygon, or imageLoaded changes
  useEffect(() => {
    if (imageLoaded) {
      redrawCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygons, currentPoints, selectedPolygon, imageLoaded]);

  // Get canvas coordinates from mouse/touch event
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;

    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Scale coordinates based on canvas size vs display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: x * scaleX,
      y: y * scaleY,
    };
  };

  // Handle mouse/touch down
  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getCanvasCoordinates(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentPoints([point]);
  };

  // Handle mouse/touch move
  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const point = getCanvasCoordinates(e);
    if (!point) return;

    setCurrentPoints(prev => [...prev, point]);
  };

  // Handle mouse/touch up - complete polygon
  const handleEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || currentPoints.length < 3) {
      setIsDrawing(false);
      setCurrentPoints([]);
      return;
    }

    // Create polygon from current points
    const polygon: Polygon = {
      id: `polygon-${Date.now()}`,
      points: [...currentPoints],
    };

    setPolygons(prev => [...prev, polygon]);
    setCurrentPoints([]);
    setIsDrawing(false);
    toast.success('Polygon annotation created');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        const canvas = canvasRef.current;
        if (canvas) {
          // Maintain aspect ratio while fitting to screen
          const maxWidth = Math.min(window.innerWidth - 32, 800);
          const maxHeight = Math.min(window.innerHeight - 200, 600);
          const aspectRatio = img.width / img.height;
          
          let canvasWidth = maxWidth;
          let canvasHeight = maxWidth / aspectRatio;
          
          if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
          }
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
        }
        setImageLoaded(true);
        toast.success('Image loaded');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Save annotations as JSON
  const handleSave = () => {
    if (polygons.length === 0) {
      toast.error('No annotations to save');
      return;
    }

    const annotations = {
      version: '1.0',
      annotations: polygons.map(polygon => ({
        id: polygon.id,
        polygon: polygon.points,
        coco: polygonToCOCO(polygon.points),
      })),
    };

    const blob = new Blob([JSON.stringify(annotations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotations-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Annotations saved');
  };

  // Export to COCO format
  const handleExportCOCO = () => {
    if (polygons.length === 0) {
      toast.error('No annotations to export');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cocoFormat = {
      info: {
        description: 'Annotations exported from Annotate App',
        version: '1.0',
        date_created: new Date().toISOString(),
      },
      images: [{
        id: 1,
        width: canvas.width,
        height: canvas.height,
        file_name: 'annotated_image.jpg',
      }],
      annotations: polygons.map((polygon, index) => ({
        id: index + 1,
        image_id: 1,
        category_id: 1,
        segmentation: [polygonToCOCO(polygon.points)],
        area: calculatePolygonArea(polygon.points),
        bbox: calculateBoundingBox(polygon.points),
        iscrowd: 0,
      })),
      categories: [{
        id: 1,
        name: 'object',
        supercategory: 'none',
      }],
    };

    const blob = new Blob([JSON.stringify(cocoFormat, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coco-annotations-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Exported to COCO format');
  };

  // Calculate polygon area using shoelace formula
  const calculatePolygonArea = (points: Point[]): number => {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  // Calculate bounding box
  const calculateBoundingBox = (points: Point[]): [number, number, number, number] => {
    if (points.length === 0) return [0, 0, 0, 0];
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return [minX, minY, maxX - minX, maxY - minY];
  };

  // Clear all annotations
  const handleClear = () => {
    setPolygons([]);
    setCurrentPoints([]);
    setSelectedPolygon(null);
    toast.success('All annotations cleared');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <div className="container px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Annotate</h1>
          <p className="text-sm text-muted-foreground">Draw polygons to annotate images</p>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap gap-2">
          <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            disabled={polygons.length === 0}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save JSON</span>
          </Button>

          <Button
            onClick={handleExportCOCO}
            variant="outline"
            size="sm"
            disabled={polygons.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export COCO</span>
          </Button>

          <Button
            onClick={handleClear}
            variant="destructive"
            size="sm"
            disabled={polygons.length === 0}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

        {/* Canvas container */}
        <div className="relative w-full overflow-auto rounded-lg border border-border bg-secondary/30 p-4">
          <canvas
            ref={canvasRef}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="cursor-crosshair touch-none w-full max-w-full border border-border rounded bg-white shadow-lg"
            style={{
              maxHeight: 'calc(100vh - 300px)',
            }}
          />
        </div>

        {/* Instructions */}
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">How to use:</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Click and drag (or touch and drag) to draw a polygon</li>
            <li>• Release to complete the annotation</li>
            <li>• Upload an image to annotate on top of it</li>
            <li>• Save annotations as JSON or export to COCO format</li>
            <li>• {polygons.length} polygon{polygons.length !== 1 ? 's' : ''} created</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
