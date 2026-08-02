import React, { useState, useMemo } from 'react';
import { Candidate, CountyData } from '../types';
import { KENYAN_COUNTIES } from '../data/counties';
import { MapPin, Filter, Layers, Users, ShieldAlert, Award, ChevronRight, RefreshCw, ZoomIn, Info, Eye, CheckCircle2 } from 'lucide-react';

interface CountyCandidateMapProps {
  candidates: Candidate[];
  selectedCounty: string;
  onSelectCounty: (countyName: string) => void;
  selectedTag?: string;
}

// Kenya Geo Bounding Box for Coordinate Projection
const LAT_MIN = -4.7;
const LAT_MAX = 4.8;
const LNG_MIN = 33.8;
const LNG_MAX = 42.0;

/**
 * Projects (lat, lng) into percentage X (0-100%) and Y (0-100%) for visual rendering
 */
function projectCoordinates(lat: number, lng: number): { x: number; y: number } {
  // Longitude maps linearly to X (Left: West 33.8E, Right: East 42.0E)
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  // Latitude maps inverted to Y (Top: North 4.8N, Bottom: South -4.7S)
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;

  // Clamp values between 5% and 95% to keep markers well inside container padding
  return {
    x: Math.max(6, Math.min(94, x)),
    y: Math.max(6, Math.min(94, y)),
  };
}

interface CountyDensityInfo {
  total: number;
  red: number;
  green: number;
  purple: number;
  mcas: number;
  mps: number;
  senators: number;
  governors: number;
  candidatesList: Candidate[];
}

export const CountyCandidateMap: React.FC<CountyCandidateMapProps> = ({
  candidates,
  selectedCounty,
  onSelectCounty,
  selectedTag = 'all',
}) => {
  const [hoveredCounty, setHoveredCounty] = useState<CountyData | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [densityFilter, setDensityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Calculate Candidate Density Per County
  const countyDensityMap = useMemo<Record<string, CountyDensityInfo>>(() => {
    const counts: Record<string, CountyDensityInfo> = {};

    // Initialize all counties in KENYAN_COUNTIES
    KENYAN_COUNTIES.forEach((county) => {
      counts[county.name] = {
        total: 0,
        red: 0,
        green: 0,
        purple: 0,
        mcas: 0,
        mps: 0,
        senators: 0,
        governors: 0,
        candidatesList: [],
      };
    });

    // Count candidates
    candidates.forEach((cand) => {
      const cName = cand.county;
      if (!counts[cName]) {
        counts[cName] = {
          total: 0,
          red: 0,
          green: 0,
          purple: 0,
          mcas: 0,
          mps: 0,
          senators: 0,
          governors: 0,
          candidatesList: [],
        };
      }
      counts[cName].total += 1;
      counts[cName].candidatesList.push(cand);

      if (cand.tagColor === 'red') counts[cName].red += 1;
      if (cand.tagColor === 'green') counts[cName].green += 1;
      if (cand.tagColor === 'purple') counts[cName].purple += 1;

      if (cand.position === 'MCA') counts[cName].mcas += 1;
      if (cand.position === 'MP') counts[cName].mps += 1;
      if (cand.position === 'Senator') counts[cName].senators += 1;
      if (cand.position === 'Governor') counts[cName].governors += 1;
    });

    return counts;
  }, [candidates]);

  // Max candidates in any single county for relative intensity scale
  const maxDensity = useMemo(() => {
    let max = 1;
    (Object.values(countyDensityMap) as CountyDensityInfo[]).forEach((d) => {
      if (d.total > max) max = d.total;
    });
    return max;
  }, [countyDensityMap]);

  // Total candidates across mapped counties
  const totalMappedCandidates = useMemo(() => {
    return (Object.values(countyDensityMap) as CountyDensityInfo[]).reduce(
      (sum, item) => sum + item.total,
      0
    );
  }, [countyDensityMap]);

  // Sorted Counties by Density
  const sortedCountiesByDensity = useMemo(() => {
    return [...KENYAN_COUNTIES].sort((a, b) => {
      const countA = countyDensityMap[a.name]?.total || 0;
      const countB = countyDensityMap[b.name]?.total || 0;
      return countB - countA;
    });
  }, [KENYAN_COUNTIES, countyDensityMap]);

  // Filtered Counties based on density filter
  const displayedCounties = useMemo(() => {
    if (densityFilter === 'all') return sortedCountiesByDensity;
    return sortedCountiesByDensity.filter((county) => {
      const count = countyDensityMap[county.name]?.total || 0;
      if (densityFilter === 'high') return count >= 3;
      if (densityFilter === 'medium') return count === 1 || count === 2;
      if (densityFilter === 'low') return count === 0;
      return true;
    });
  }, [sortedCountiesByDensity, countyDensityMap, densityFilter]);

  // Helper to get color class based on density and dominant candidate tag
  const getDensityColor = (count: number, redCount: number, greenCount: number) => {
    if (count === 0) {
      return {
        bg: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700',
        dot: 'bg-neutral-400',
        ring: 'border-neutral-400',
      };
    }
    if (redCount > greenCount) {
      return {
        bg: 'bg-red-600 text-white border-red-800 shadow-red-500/20 shadow-md',
        dot: 'bg-red-400',
        ring: 'border-red-500 animate-ping',
      };
    }
    if (greenCount >= redCount && greenCount > 0) {
      return {
        bg: 'bg-emerald-600 text-white border-emerald-800 shadow-emerald-500/20 shadow-md',
        dot: 'bg-emerald-400',
        ring: 'border-emerald-500 animate-ping',
      };
    }
    return {
      bg: 'bg-blue-600 text-white border-blue-800 shadow-blue-500/20 shadow-md',
      dot: 'bg-blue-400',
      ring: 'border-blue-500 animate-ping',
    };
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 rounded-xl overflow-hidden shadow-lg mb-6">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-neutral-900 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg text-white shadow-sm shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                Kenya Candidate Density Map
              </h2>
              <span className="text-[10px] font-black uppercase bg-red-600/30 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                KENYAN_COUNTIES GPS Sync
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Geographic distribution of candidates & MCAs mapped across Kenya's 47 counties.
            </p>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="bg-neutral-800 p-0.5 rounded-lg flex items-center border border-neutral-700 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 font-bold uppercase rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 font-bold uppercase rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>County Leaderboard ({displayedCounties.length})</span>
            </button>
          </div>

          {selectedCounty !== 'all' && (
            <button
              onClick={() => onSelectCounty('all')}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/40 rounded text-xs font-bold uppercase transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset County Filter ({selectedCounty})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      {viewMode === 'map' ? (
        <div className="relative bg-neutral-950 min-h-[420px] sm:min-h-[520px] p-4 flex flex-col justify-between overflow-hidden">
          {/* Subtle Map Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #404040 1px, transparent 1px), linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
              backgroundSize: '24px 24px, 48px 48px, 48px 48px',
            }}
          />

          {/* SVG Outline / Regional Watermarks */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-[120px] sm:text-[180px] font-black uppercase text-white tracking-widest select-none">
              KENYA
            </span>
          </div>

          {/* Map Top Bar Stat Info */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-neutral-900/80 backdrop-blur-xs p-2.5 rounded-lg border border-neutral-800 text-xs text-white">
            <div className="flex items-center gap-3">
              <span className="font-mono text-neutral-400 text-[10px] uppercase">
                COORDINATES: <strong className="text-white">4.8°N - 4.7°S / 33.8°E - 42.0°E</strong>
              </span>
              <span className="hidden sm:inline-block text-neutral-600">•</span>
              <span className="text-[11px] font-bold text-neutral-300">
                Mapped Counties: <strong className="text-red-400">{KENYAN_COUNTIES.length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Density Scale:</span>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded">0</span>
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded">1-2</span>
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded font-bold">3+ (Good)</span>
                <span className="px-1.5 py-0.5 bg-red-600 text-white rounded font-bold">3+ (Risk)</span>
              </div>
            </div>
          </div>

          {/* Map Canvas with Coordinates Mapped Pins */}
          <div className="relative w-full h-[360px] sm:h-[420px] my-3">
            {KENYAN_COUNTIES.map((county) => {
              const coords = county.coordinates
                ? projectCoordinates(county.coordinates.lat, county.coordinates.lng)
                : { x: 50, y: 50 };

              const density = countyDensityMap[county.name] || {
                total: 0,
                red: 0,
                green: 0,
                purple: 0,
                candidatesList: [],
              };
              const isSelected = selectedCounty.toLowerCase() === county.name.toLowerCase();
              const isHovered = hoveredCounty?.name === county.name;

              const styleColors = getDensityColor(density.total, density.red, density.green);

              return (
                <div
                  key={county.code}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-20"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onMouseEnter={() => setHoveredCounty(county)}
                  onMouseLeave={() => setHoveredCounty(null)}
                >
                  {/* Ping Ring Effect for Active/Populated Counties */}
                  {density.total > 0 && (
                    <span
                      className={`absolute -inset-1 rounded-full opacity-75 ${styleColors.ring} pointer-events-none`}
                    />
                  )}

                  {/* Marker Pin Button */}
                  <button
                    onClick={() => onSelectCounty(isSelected ? 'all' : county.name)}
                    className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full font-black text-[11px] border cursor-pointer transition-all duration-200 shadow-md ${
                      styleColors.bg
                    } ${
                      isSelected
                        ? 'ring-4 ring-amber-400 scale-125 z-30'
                        : isHovered
                        ? 'scale-115 ring-2 ring-white z-30'
                        : 'hover:scale-110'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[70px] sm:max-w-[90px]">{county.name}</span>
                    <span className="ml-0.5 px-1 py-0.2 bg-black/40 rounded-full text-[9px] font-mono font-black">
                      {density.total}
                    </span>
                  </button>

                  {/* Hover Tooltip Card */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-neutral-900 text-white border-2 border-neutral-700 rounded-lg p-3 shadow-2xl z-40 text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-2">
                        <div>
                          <h4 className="font-black text-xs uppercase text-amber-400">{county.name} County</h4>
                          <span className="text-[9px] text-neutral-400 uppercase">{county.region}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                          Code #{county.code}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-neutral-400">Total Tracked:</span>
                          <span className="text-white font-black">{density.total} Leaders</span>
                        </div>

                        {density.total > 0 && (
                          <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[9px] font-bold">
                            <div className="bg-red-950/60 border border-red-800 text-red-300 p-1 rounded">
                              <span className="block text-[11px] font-black">{density.red}</span>
                              <span>High Risk</span>
                            </div>
                            <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-1 rounded">
                              <span className="block text-[11px] font-black">{density.green}</span>
                              <span>Champions</span>
                            </div>
                            <div className="bg-purple-950/60 border border-purple-800 text-purple-300 p-1 rounded">
                              <span className="block text-[11px] font-black">{density.purple}</span>
                              <span>Notice</span>
                            </div>
                          </div>
                        )}

                        <div className="pt-1.5 text-[9px] text-neutral-400 font-semibold border-t border-neutral-800">
                          Constituencies: {county.constituencies.slice(0, 3).join(', ')}
                          {county.constituencies.length > 3 && ` +${county.constituencies.length - 3} more`}
                        </div>

                        <div className="pt-1 text-[9px] font-bold text-amber-400 flex items-center gap-1 justify-end">
                          <span>Click to filter directory</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar */}
          <div className="relative z-10 bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-[11px]">
                Click any county pin above to instant-filter candidate records by location.
              </span>
            </div>

            {selectedCounty !== 'all' && (
              <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded text-amber-300 font-bold text-xs uppercase border border-amber-500/30">
                <span>Active Filter: {selectedCounty} County</span>
                <button
                  onClick={() => onSelectCounty('all')}
                  className="text-neutral-400 hover:text-white underline text-[10px]"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* County Leaderboard Grid View */
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-600" />
              <span className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-100">
                Filter by Density Level:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setDensityFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  densityFilter === 'all'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                All Counties ({KENYAN_COUNTIES.length})
              </button>
              <button
                onClick={() => setDensityFilter('high')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  densityFilter === 'high'
                    ? 'bg-red-600 text-white font-black'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                High Density (3+ candidates)
              </button>
              <button
                onClick={() => setDensityFilter('medium')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  densityFilter === 'medium'
                    ? 'bg-blue-600 text-white font-black'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                Medium (1-2 candidates)
              </button>
              <button
                onClick={() => setDensityFilter('low')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  densityFilter === 'low'
                    ? 'bg-neutral-800 text-neutral-300 font-black'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                Zero Tracked
              </button>
            </div>
          </div>

          {/* Grid Layout of Counties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedCounties.map((county) => {
              const density = countyDensityMap[county.name] || {
                total: 0,
                red: 0,
                green: 0,
                purple: 0,
                mcas: 0,
                mps: 0,
                candidatesList: [],
              };
              const isSelected = selectedCounty.toLowerCase() === county.name.toLowerCase();

              return (
                <div
                  key={county.code}
                  className={`p-3.5 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 shadow-md ring-2 ring-amber-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <h3 className="font-black text-sm uppercase text-neutral-900 dark:text-white">
                          {county.name} County
                        </h3>
                      </div>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase">
                        {county.region} • Code #{county.code}
                      </span>
                    </div>

                    <div
                      className={`px-2 py-1 rounded text-xs font-black font-mono shrink-0 ${
                        density.total > 0
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {density.total} Candidates
                    </div>
                  </div>

                  {/* Candidate Tag Counts & Position Badges */}
                  {density.total > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                        <div className="p-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded border border-red-300 dark:border-red-900">
                          <span className="block font-black text-xs">{density.red}</span>
                          <span>High Risk</span>
                        </div>
                        <div className="p-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-900">
                          <span className="block font-black text-xs">{density.green}</span>
                          <span>Good Leaders</span>
                        </div>
                        <div className="p-1 bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded border border-purple-300 dark:border-purple-900">
                          <span className="block font-black text-xs">{density.purple}</span>
                          <span>Notice</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-neutral-600 dark:text-neutral-300 font-semibold flex items-center justify-between">
                        <span>Positions: {density.mps} MPs, {density.mcas} MCAs</span>
                        <span>{county.constituencies.length} Constituencies</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-[10px] text-neutral-400 italic">
                      No candidate records submitted for {county.name} yet.
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between">
                    <button
                      onClick={() => onSelectCounty(isSelected ? 'all' : county.name)}
                      className={`w-full py-1.5 rounded text-[11px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-900 hover:bg-amber-600'
                          : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Active Filter Selected' : `Filter ${county.name} Candidates`}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
