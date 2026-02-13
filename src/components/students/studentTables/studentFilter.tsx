import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Languages, Countries } from "@/constant/Students";

export interface StudentFilterValues {
  language?: string;
  preferredCountry?: string;
  yearOfCompletion?: string;
  includeQrCode?: boolean;
}

interface StudentFilterProps {
  onFilterChange: (filters: StudentFilterValues) => void;
  initialFilters?: StudentFilterValues;
}

export const StudentFilter: React.FC<StudentFilterProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<StudentFilterValues>(initialFilters);

  // Update internal state when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: keyof StudentFilterValues, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: StudentFilterValues = {
      language: undefined,
      preferredCountry: undefined,
      yearOfCompletion: undefined,
      includeQrCode: false,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setOpen(false);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([, value]) =>
      value !== undefined && value !== "" && value !== false && value !== null,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {hasActiveFilters && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {
                Object.values(filters).filter(
                  (v) =>
                    v !== undefined && v !== "" && v !== false && v !== null,
                ).length
              }
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Students</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down your search results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Language Filter */}
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={filters.language || ""}
              onValueChange={(value) =>
                handleFilterChange("language", value || undefined)
              }
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                {Languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Country Filter */}
          <div className="grid gap-2">
            <Label htmlFor="preferredCountry">Preferred Country</Label>
            <Select
              value={filters.preferredCountry || ""}
              onValueChange={(value) =>
                handleFilterChange("preferredCountry", value || undefined)
              }
            >
              <SelectTrigger id="preferredCountry" className="w-full">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {Countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year of Completion Filter */}
          <div className="grid gap-2">
            <Label htmlFor="yearOfCompletion">Year of Completion</Label>
            <Select
              value={filters.yearOfCompletion || ""}
              onValueChange={(value) =>
                handleFilterChange("yearOfCompletion", value || undefined)
              }
            >
              <SelectTrigger id="yearOfCompletion" className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 8 + i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Include QR Code Filter */}
          <div className="flex items-center space-x-2 col-span-2">
            <Checkbox
              id="includeQrCode"
              checked={filters.includeQrCode || false}
              onCheckedChange={(checked) =>
                handleFilterChange("includeQrCode", checked === true)
              }
            />
            <Label
              htmlFor="includeQrCode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include students with QR code only
            </Label>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button type="button" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
