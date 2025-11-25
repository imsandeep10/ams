import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Time selector component with real-time clock interface
 * Users can select any time in 12-hour format
 */
export function TimeSelector({ value, onValueChange, disabled }: TimeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState<number>(8);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Parse existing value when component mounts or value changes
  useEffect(() => {
    if (value) {
      // Parse formats like "8-9 AM", "6:30-7:30 PM"
      const match = value.match(/^(\d+)(?::(\d+))?-(\d+)(?::(\d+))?\s*(AM|PM)$/);
      if (match) {
        setHour(parseInt(match[1]));
        setMinute(parseInt(match[2] || "0"));
        setPeriod(match[5] as "AM" | "PM");
      }
    }
  }, [value]);

  const formatTimeRange = (h: number, m: number, p: "AM" | "PM") => {
    const startHour = h === 0 ? 12 : h;
    const startMinute = m;
    
    // Calculate end time (1 hour later)
    let endHour = h + 1;
    const endMinute = m;
    let endPeriod = p;
    
    // Handle hour overflow
    if (endHour === 12) {
      endPeriod = p === "AM" ? "PM" : "AM";
    } else if (endHour === 13) {
      endHour = 1;
    }
    
    const formattedEndHour = endHour === 0 ? 12 : endHour;
    
    // Format based on whether minutes are 0 or not
    if (startMinute === 0 && endMinute === 0) {
      // Show as "8-9 AM" or "11 AM-12 PM" if crossing periods
      if (p !== endPeriod) {
        return `${startHour} ${p}-${formattedEndHour} ${endPeriod}`;
      }
      return `${startHour}-${formattedEndHour} ${endPeriod}`;
    } else {
      // Show as "6:30-7:30 AM"
      const startMinStr = startMinute.toString().padStart(2, '0');
      const endMinStr = endMinute.toString().padStart(2, '0');
      return `${startHour}:${startMinStr}-${formattedEndHour}:${endMinStr} ${endPeriod}`;
    }
  };

  const handleSelectTime = () => {
    const formatted = formatTimeRange(hour, minute, period);
    onValueChange(formatted);
    setOpen(false);
  };

  // Generate hour array
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  // Common minute presets
  const minutePresets = [0, 15, 30, 45];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-start text-left font-normal transition-colors focus:ring-2"
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">
            Select Time
          </div>
          
          {/* Hour Selection - Clock Layout */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Clock Circle Background */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 bg-gray-50"></div>
            
            {/* Clock Numbers */}
            {hours.map((h) => {
              const angle = (h * 30 - 90) * (Math.PI / 180);
              const radius = 100;
              const x = 128 + radius * Math.cos(angle);
              const y = 128 + radius * Math.sin(angle);
              
              const isSelected = hour === h;
              
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHour(h)}
                  className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-white scale-110 shadow-lg"
                      : "bg-white border border-gray-300 hover:bg-gray-100 hover:scale-105"
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                >
                  {h}
                </button>
              );
            })}
            
            {/* Center Dot */}
            <div className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 w-3 h-3 bg-primary rounded-full"></div>
          </div>

          {/* Minute Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Minutes</label>
            <div className="flex gap-2">
              {minutePresets.map((m) => (
                <Button
                  key={m}
                  type="button"
                  size="sm"
                  variant={minute === m ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMinute(m)}
                >
                  {m.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          
          </div>

          {/* AM/PM Selection */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={period === "AM" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setPeriod("AM")}
            >
              AM
            </Button>
            <Button
              type="button"
              variant={period === "PM" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setPeriod("PM")}
            >
              PM
            </Button>
          </div>

          {/* Preview */}
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Class Time Range</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatTimeRange(hour, minute, period)}
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            type="button"
            className="w-full"
            onClick={handleSelectTime}
          >
            Confirm Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
