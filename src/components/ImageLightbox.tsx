import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface ImageLightboxProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageLightbox = ({ imageUrl, alt, isOpen, onClose }: ImageLightboxProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetZoom}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Image */}
          <div 
            className="overflow-auto max-w-full max-h-full p-4 cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-none h-auto object-contain"
              style={{ maxHeight: '80vh' }}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=400&fit=crop";
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;