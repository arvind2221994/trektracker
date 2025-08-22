import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrekFiltersProps {
  filters: {
    difficulty?: string;
    duration?: string;
    climate?: string;
    country?: string;
    search?: string;
  };
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export default function TrekFilters({ filters, onFiltersChange, className }: TrekFiltersProps) {
  const updateFilter = (key: string, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className={cn("space-y-4", className)} data-testid="trek-filters">
      {/* Search Input */}
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search treks by name, location, or description..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-full"
          data-testid="input-search"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          className={cn(
            "border-sage text-slate-gray hover:bg-forest hover:text-white transition-all",
            hasActiveFilters && "bg-forest text-white"
          )}
          onClick={clearFilters}
          data-testid="button-all-filters"
        >
          <Filter className="h-4 w-4 mr-2" />
          {hasActiveFilters ? "Clear Filters" : "All Filters"}
          {hasActiveFilters && <X className="h-4 w-4 ml-2" />}
        </Button>

        <Select value={filters.difficulty || ""} onValueChange={(value) => updateFilter("difficulty", value)}>
          <SelectTrigger className="w-auto min-w-[120px]" data-testid="select-difficulty">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Challenging">Challenging</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.duration || ""} onValueChange={(value) => updateFilter("duration", value)}>
          <SelectTrigger className="w-auto min-w-[120px]" data-testid="select-duration">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Durations</SelectItem>
            <SelectItem value="day-hikes">Day Hikes</SelectItem>
            <SelectItem value="weekend">2-3 Days</SelectItem>
            <SelectItem value="week">4-7 Days</SelectItem>
            <SelectItem value="long">1+ Weeks</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.climate || ""} onValueChange={(value) => updateFilter("climate", value)}>
          <SelectTrigger className="w-auto min-w-[120px]" data-testid="select-climate">
            <SelectValue placeholder="Climate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Climates</SelectItem>
            <SelectItem value="alpine">Alpine</SelectItem>
            <SelectItem value="temperate">Temperate</SelectItem>
            <SelectItem value="tropical">Tropical</SelectItem>
            <SelectItem value="desert">Desert</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.country || ""} onValueChange={(value) => updateFilter("country", value)}>
          <SelectTrigger className="w-auto min-w-[120px]" data-testid="select-country">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Countries</SelectItem>
            <SelectItem value="Nepal">Nepal</SelectItem>
            <SelectItem value="Peru">Peru</SelectItem>
            <SelectItem value="Chile">Chile</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Multi-country">Multi-country</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
