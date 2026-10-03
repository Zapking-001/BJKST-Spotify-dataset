import { useState, useRef, useEffect, useMemo } from 'react';
import { Spline, Search, Filter, BarChart3, ArrowUpDown, X, Table } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { spotifyDataset } from '../data/spotifySample';

gsap.registerPlugin(ScrollTrigger);

export const NaiveFailsChart = () => {
  const data = [
    { name: 'Ed Sheeran', count: 67, type: 'head' },
    { name: 'The Weeknd', count: 42, type: 'head' },
    { name: 'Drake', count: 35, type: 'head' },
    { name: 'Taylor Swift', count: 31, type: 'head' },
    { name: '1,987 Artists', count: 1, type: 'tail' },
  ];

  return (
    <div className="w-full h-80 bg-[#0A0D14] rounded-xl border border-white/5 p-6 shadow-inner font-mono text-sm relative z-20 pointer-events-auto"
         onKeyDown={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} onPointerMove={(e) => e.stopPropagation()}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#666" 
            tick={{ fill: '#888', fontSize: 12, fontFamily: 'JetBrains Mono' }} 
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
          <Tooltip 
            cursor={{ fill: '#ffffff05' }}
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontFamily: 'JetBrains Mono', color: '#fff' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.type === 'head' ? '#10b981' : '#64748b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute top-4 right-6 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] px-3 py-1 rounded font-bold">
        Random sampling over-selects the head.
      </div>
    </div>
  );
};

const ALL_35_COLUMNS = [
  { key: 'track_uri', label: 'Track_URI', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-56' },
  { key: 'track_name', label: 'Track_Name', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-52' },
  { key: 'artist_uris', label: 'Artist_URI(s)', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-56' },
  { key: 'artist_names', label: 'Artist_Name(s)', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-52' },
  { key: 'album_uri', label: 'Album_URI', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-56' },
  { key: 'album_name', label: 'Album_Name', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-48' },
  { key: 'album_artist_uris', label: 'Album_Artist_URI(s)', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-56' },
  { key: 'album_artist_names', label: 'Album_Artist_Name(s)', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-52' },
  { key: 'release_date', label: 'Album_Release_Date', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-36' },
  { key: 'album_image_url', label: 'Album_Image_URL', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-64' },
  { key: 'disc_number', label: 'Disc_Number', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-24 text-right' },
  { key: 'track_number', label: 'Track_Number', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-24 text-right' },
  { key: 'duration_ms', label: 'Track_Duration_ms', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-32 text-right' },
  { key: 'track_preview_url', label: 'Track_Preview_URL', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-64' },
  { key: 'explicit', label: 'Explicit', type: 'lgl', typeColor: 'text-[#F472B6] bg-[#F472B6]/10', width: 'w-20 text-center' },
  { key: 'popularity', label: 'Popularity', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-24 text-right' },
  { key: 'isrc', label: 'ISRC', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-36' },
  { key: 'added_by', label: 'Added_By', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-44' },
  { key: 'added_at', label: 'Added_At', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-44' },
  { key: 'artist_genres', label: 'Artist_Genres', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-64' },
  { key: 'danceability', label: 'Danceability', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-28 text-right' },
  { key: 'energy', label: 'Energy', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'key', label: 'Key', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-20 text-right' },
  { key: 'loudness', label: 'Loudness', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'mode', label: 'Mode', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-20 text-right' },
  { key: 'speechiness', label: 'Speechiness', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-28 text-right' },
  { key: 'acousticness', label: 'Acousticness', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-28 text-right' },
  { key: 'instrumentalness', label: 'Instrumentalness', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-32 text-right' },
  { key: 'liveness', label: 'Liveness', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'valence', label: 'Valence', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'tempo', label: 'Tempo', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'time_signature', label: 'Time_Signature', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-28 text-right' },
  { key: 'album_genres', label: 'Album_Genres', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-36' },
  { key: 'label', label: 'Label', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-48' },
  { key: 'copyrights', label: 'Copyrights', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-72' },
];

const TOKEN_COLUMNS = [
  { key: 'id', label: 'Token_ID', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-24 text-right' },
  { key: 'orig_row', label: 'Orig_Row', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-24 text-right' },
  { key: 'artist_name', label: 'Artist_Token', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-52' },
  { key: 'artist_uri', label: 'Artist_URI', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-56' },
  { key: 'track_name', label: 'Track_Name', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-52' },
  { key: 'album_name', label: 'Album_Name', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-48' },
  { key: 'release_date', label: 'Album_Release_Date', type: 'chr', typeColor: 'text-[#38BDF8] bg-[#38BDF8]/10', width: 'w-36' },
  { key: 'popularity', label: 'Popularity', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-24 text-right' },
  { key: 'duration_ms', label: 'Track_Duration_ms', type: 'int', typeColor: 'text-[#FBBF24] bg-[#FBBF24]/10', width: 'w-32 text-right' },
  { key: 'danceability', label: 'Danceability', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-28 text-right' },
  { key: 'energy', label: 'Energy', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'tempo', label: 'Tempo', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-24 text-right' },
  { key: 'acousticness', label: 'Acousticness', type: 'dbl', typeColor: 'text-[#34D399] bg-[#34D399]/10', width: 'w-28 text-right' },
];

export const DatasetInspector = () => {
  const [mode, setMode] = useState<'raw' | 'tokens'>('raw'); // Mode A: Raw Stream vs Mode B: Token Stream
  const [search, setSearch] = useState('');
  const [filterPreset, setFilterPreset] = useState<'all' | 'collabs' | 'pop80' | 'classics' | 'modern'>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Virtualization state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const ROW_HEIGHT = 34; // compact IDE row height
  const VIEWPORT_HEIGHT = 440; // visible height
  const OVERSCAN = 12;

  const rawRows = spotifyDataset.rawRows;
  const tokenRows = spotifyDataset.tokenRows;

  const activeColumns = mode === 'raw' ? ALL_35_COLUMNS : TOKEN_COLUMNS;

  // Filter & sort logic
  const filteredData = useMemo(() => {
    let rows: any[] = mode === 'raw' ? [...rawRows] : [...tokenRows];

    // Search query across all fields
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => {
        return Object.values(r).some((v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q));
      });
    }

    // Presets
    if (filterPreset === 'collabs') {
      rows = rows.filter((r) => r.is_collab);
    } else if (filterPreset === 'pop80') {
      rows = rows.filter((r) => (r.popularity || 0) >= 80);
    } else if (filterPreset === 'classics') {
      rows = rows.filter((r) => parseInt(String(r.release_date || '').slice(0, 4) || '2000', 10) < 1990);
    } else if (filterPreset === 'modern') {
      rows = rows.filter((r) => parseInt(String(r.release_date || '').slice(0, 4) || '2000', 10) >= 2015);
    }

    // Sort
    if (sortCol) {
      rows.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        const strA = String(valA || '').toLowerCase();
        const strB = String(valB || '').toLowerCase();
        return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    return rows;
  }, [mode, search, filterPreset, sortCol, sortAsc, rawRows, tokenRows]);

  // Virtual slice calculation
  const totalRows = filteredData.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(totalRows - 1, Math.floor((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN);
  const visibleRows = filteredData.slice(startIndex, endIndex + 1);
  const paddingTop = startIndex * ROW_HEIGHT;
  const paddingBottom = Math.max(0, (totalRows - endIndex - 1) * ROW_HEIGHT);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleSort = (colKey: string) => {
    if (sortCol === colKey) {
      if (sortAsc) setSortAsc(false);
      else { setSortCol(null); setSortAsc(true); }
    } else {
      setSortCol(colKey);
      setSortAsc(true);
    }
  };

  const formatDuration = (ms: number | undefined) => {
    if (!ms) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const renderCellContent = (col: typeof ALL_35_COLUMNS[0], row: any) => {
    const val = row[col.key];

    switch (col.key) {
      case 'track_name':
        return (
          <span className="text-white font-medium truncate block" title={val}>
            {val || '—'}
          </span>
        );

      case 'artist_names':
      case 'artist_name':
        if (row.is_collab) {
          return (
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[#F59E0B] font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] truncate" title={val}>
                {val}
              </span>
              <span className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-1 py-0.2 rounded text-[9px] shrink-0 font-sans">
                COLLAB
              </span>
            </div>
          );
        }
        return (
          <span className={`truncate block ${mode === 'tokens' ? 'text-[#00B4D8]' : 'text-[#E2E8F0]'}`} title={val}>
            {val || '—'}
          </span>
        );

      case 'duration_ms':
        return (
          <span className="text-right font-mono text-[#E2E8F0] block">
            {formatDuration(val)}
          </span>
        );

      case 'popularity':
        return (
          <div className="text-right">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-block ${
              val >= 80 ? 'bg-[#00D26A]/20 text-[#00D26A]' :
              val >= 60 ? 'bg-[#00B4D8]/20 text-[#00B4D8]' :
              'bg-white/5 text-white/50'
            }`}>
              {val}
            </span>
          </div>
        );

      case 'explicit':
        return (
          <div className="text-center">
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold inline-block ${
              val ? 'bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/40' : 'text-[#64748B]'
            }`}>
              {val ? 'TRUE' : 'FALSE'}
            </span>
          </div>
        );

      case 'danceability':
      case 'energy':
      case 'loudness':
      case 'speechiness':
      case 'acousticness':
      case 'instrumentalness':
      case 'liveness':
      case 'valence':
        return (
          <span className="text-right font-mono text-[#34D399] block">
            {typeof val === 'number' ? val.toFixed(3) : (val ?? '—')}
          </span>
        );

      case 'tempo':
        return (
          <span className="text-right font-mono text-[#94A3B8] block">
            {typeof val === 'number' ? `${Math.round(val)} bpm` : (val ?? '—')}
          </span>
        );

      case 'disc_number':
      case 'track_number':
      case 'key':
      case 'mode':
      case 'time_signature':
      case 'id':
      case 'orig_row':
        return (
          <span className="text-right font-mono text-[#FBBF24] block">
            {val ?? '—'}
          </span>
        );

      default:
        return (
          <span className="text-[#94A3B8] font-mono text-[10px] truncate block" title={String(val || '')}>
            {String(val || '—')}
          </span>
        );
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col bg-[#0F141C] border border-[#1B2331] rounded-2xl shadow-2xl overflow-hidden font-mono text-[12px] text-[#E2E8F0] select-none pointer-events-auto"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* 1. RStudio Window Chrome / Tab Bar */}
      <div className="bg-[#131A24] border-b border-[#1B2331] px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* OS Dots */}
          <div className="flex gap-1.5 items-center mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60 border border-[#EF4444]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60 border border-[#F59E0B]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60 border border-[#10B981]" />
          </div>

          {/* RStudio Active Tab */}
          <div className="flex items-center gap-2 bg-[#0F141C] border border-[#1B2331] border-b-0 px-3 py-1 rounded-t-md text-xs font-medium text-white shadow-sm">
            <Table size={13} className="text-[#00B4D8]" />
            <span>top_10000_1950-now.csv</span>
            <span className="text-[#64748B] text-[10px] ml-1">[View]</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#94A3B8] text-xs pl-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D26A] animate-pulse" />
            <span>(10,000 obs. of 35 variables)</span>
          </div>
        </div>

        {/* Mode Switcher: Mode A (Raw Tracks) vs Mode B (Artist Tokens) */}
        <div className="flex items-center bg-[#0B0F15] p-1 rounded-lg border border-[#1B2331] gap-1">
          <button
            onClick={() => { setMode('raw'); setScrollTop(0); }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'raw'
                ? 'bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/40 shadow-[0_0_10px_rgba(0,210,106,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>Tracks View (Raw 35 Cols)</span>
            <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] text-white/70">10k</span>
          </button>

          <button
            onClick={() => { setMode('tokens'); setScrollTop(0); }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'tokens'
                ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/40 shadow-[0_0_10px_rgba(0,180,216,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>Token Stream (Artists)</span>
            <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] text-[#00B4D8]">m=12,035</span>
          </button>
        </div>
      </div>

      {/* 2. Top Header Toolbar (Live Search, Filter Preset, Counter) */}
      <div className="bg-[#111722] border-b border-[#1B2331] px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Search input */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all 35 columns (artist, track, album, URI, genre)..."
              className="w-full bg-[#0A0D13] border border-[#1B2331] rounded-md pl-8 pr-7 py-1 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#00B4D8] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Filter toggle */}
          <button
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              showFilterBar || filterPreset !== 'all'
                ? 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]'
                : 'bg-[#18212F] border-[#1B2331] text-[#94A3B8] hover:text-white'
            }`}
            title="Filter presets"
          >
            <Filter size={12} />
            <span>Filter</span>
            {filterPreset !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />}
          </button>

          {/* Summary toggle */}
          <button
            onClick={() => setShowSummary(!showSummary)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSummary
                ? 'bg-[#00D26A]/20 border-[#00D26A]/40 text-[#00D26A]'
                : 'bg-[#18212F] border-[#1B2331] text-[#94A3B8] hover:text-white'
            }`}
            title="Toggle R statistical summary view"
          >
            <BarChart3 size={12} />
            <span>Summary</span>
          </button>

          {/* Entries Counter */}
          <div className="text-[11px] font-mono text-[#94A3B8] bg-[#0A0D13] border border-[#1B2331] px-3 py-1 rounded-md">
            Showing <strong className="text-white">{totalRows > 0 ? startIndex + 1 : 0}</strong> to{' '}
            <strong className="text-white">{Math.min(endIndex + 1, totalRows)}</strong> of{' '}
            <strong className="text-[#00D26A]">{totalRows.toLocaleString()}</strong> entries{' '}
            <span className="text-[#64748B]">({activeColumns.length} total columns)</span>
          </div>
        </div>
      </div>

      {/* Filter Presets Bar (Expandable) */}
      {showFilterBar && (
        <div className="bg-[#0B0F16] border-b border-[#1B2331] px-4 py-1.5 flex items-center gap-2 text-xs">
          <span className="text-[#64748B] text-[11px] font-semibold uppercase">Presets:</span>
          {[
            { id: 'all', label: 'All Observations' },
            { id: 'collabs', label: 'Collaborations Only (Mike Posner, Seeb etc.)' },
            { id: 'pop80', label: 'Top Hits (Popularity ≥ 80)' },
            { id: 'classics', label: 'Classics (< 1990)' },
            { id: 'modern', label: 'Modern (≥ 2015)' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setFilterPreset(preset.id as any)}
              className={`px-2.5 py-0.5 rounded text-[11px] border transition-all cursor-pointer ${
                filterPreset === preset.id
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] font-bold'
                  : 'bg-[#131A24] border-[#1B2331] text-[#94A3B8] hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* 3. Main Data Viewport / Summary View */}
      {showSummary ? (
        /* Statistical summary view */
        <div className="flex-1 overflow-y-auto p-6 bg-[#0B0F15] font-mono text-xs space-y-4">
          <div className="text-[#00D26A] font-bold text-sm flex items-center gap-2">
            <BarChart3 size={16} />
            <span>&gt; str(top_10000_spotify_stream)</span>
          </div>
          <div className="bg-[#0F141C] border border-[#1B2331] p-4 rounded-xl text-[#94A3B8] leading-relaxed">
            <div>'data.frame': 10000 obs. of 35 variables:</div>
            <div>$ Track_URI : chr "spotify:track:0vNPJrUr..." "spotify:track:0NpvdCO5..." ...</div>
            <div>$ Track_Name: chr "Fader" "Sherry" "I Took A Pill In Ibiza" ...</div>
            <div>$ Artist_URI(s): chr "spotify:artist:4W48h..." "spotify:artist:6mcrZQ..." ...</div>
            <div>$ Artist_Name(s): chr "The Temper Trap" "Frankie Valli & The Four Seasons" ...</div>
            <div>$ Duration_ms: int 217440 152866 197933 213440 244586 ...</div>
            <div>$ Popularity : int 58 64 85 79 91 88 74 69 77 82 ...</div>
            <div>$ Danceability: num 0.485 0.528 0.673 0.612 0.741 ...</div>
            <div>$ Tempo : num 128 116.5 102 120 124 ...</div>
          </div>

          <div className="text-[#00B4D8] font-bold text-sm">&gt; summary(streaming_bjkst_metrics)</div>
          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-[#0F141C] border border-[#1B2331] p-4 rounded-xl">
              <div className="text-[#64748B] text-[10px] uppercase">Stream Length (m)</div>
              <div className="text-2xl font-bold text-[#00D26A] mt-1">12,035</div>
              <div className="text-[#94A3B8] text-[11px] mt-1">Tokens across all track credits</div>
            </div>
            <div className="bg-[#0F141C] border border-[#1B2331] p-4 rounded-xl">
              <div className="text-[#64748B] text-[10px] uppercase">Unique Artists (d)</div>
              <div className="text-2xl font-bold text-[#00B4D8] mt-1">3,813</div>
              <div className="text-[#94A3B8] text-[11px] mt-1">True distinct elements in stream</div>
            </div>
            <div className="bg-[#0F141C] border border-[#1B2331] p-4 rounded-xl">
              <div className="text-[#64748B] text-[10px] uppercase">Mean Frequency (m/d)</div>
              <div className="text-2xl font-bold text-[#F59E0B] mt-1">3.156</div>
              <div className="text-[#94A3B8] text-[11px] mt-1">Tokens per distinct artist</div>
            </div>
          </div>
        </div>
      ) : (
        /* Virtualized Grid View */
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto relative border-b border-[#1B2331]"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A3649 #0F141C' }}
        >
          <table className={`w-full border-collapse border-spacing-0 table-fixed text-[11px] ${mode === 'raw' ? 'min-w-[5600px]' : 'min-w-[2000px]'}`}>
            {/* Table Header with Data Type Badges */}
            <thead className="sticky top-0 z-30 bg-[#131A24] border-b border-[#1B2331] shadow-md">
              <tr className="h-10 text-left text-[#94A3B8]">
                {/* Sticky Row Index Header */}
                <th className="sticky left-0 z-40 bg-[#141C28] border-r border-[#1B2331] px-3 w-16 text-right font-normal text-[#64748B]">
                  #
                </th>

                {/* Columns */}
                {activeColumns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-3 py-1 border-r border-[#1B2331] hover:bg-[#1B2433] transition-colors cursor-pointer select-none ${col.width}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-white tracking-wide truncate">{col.label}</span>
                      <span className="text-[#64748B]">
                        {sortCol === col.key ? (sortAsc ? '▲' : '▼') : <ArrowUpDown size={10} />}
                      </span>
                    </div>
                    <div className="mt-0.5">
                      <span className={`px-1 py-0.2 rounded text-[9px] font-mono tracking-tight ${col.typeColor}`}>
                        &lt;{col.type}&gt;
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Virtualized Rows with top & bottom padding */}
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <td colSpan={activeColumns.length + 1} style={{ height: `${paddingTop}px` }} />
                </tr>
              )}

              {visibleRows.map((row, idx) => {
                const absoluteIndex = startIndex + idx + 1;

                return (
                  <tr
                    key={row.id || absoluteIndex}
                    className="h-[34px] hover:bg-[#1B2E3D] transition-colors border-b border-[#161F2E] group"
                  >
                    {/* Sticky Row Index */}
                    <td className="sticky left-0 z-20 bg-[#131A24] group-hover:bg-[#1B2E3D] border-r border-[#1B2331] px-3 text-right text-[#64748B] group-hover:text-white/80 font-mono text-[10px]">
                      {absoluteIndex}
                    </td>

                    {/* All Columns Rendered */}
                    {activeColumns.map((col) => (
                      <td key={col.key} className={`px-3 border-r border-[#1B2331] ${col.width}`}>
                        {renderCellContent(col, row)}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {paddingBottom > 0 && (
                <tr>
                  <td colSpan={activeColumns.length + 1} style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. R Console Footer */}
      <div className="bg-[#0B0F15] border-t border-[#1B2331] px-5 py-3 shrink-0 font-mono text-xs text-[#94A3B8]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[#00D26A] font-bold">&gt;</span>
              <span className="text-white/80">length(stream)</span>
              <span className="text-[#00D26A] font-bold ml-2">[1] 12035</span>
              <span className="text-[#64748B] italic ml-1"># Total stream tokens (m)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#00D26A] font-bold">&gt;</span>
              <span className="text-white/80">length(unique(artist_uris))</span>
              <span className="text-[#00B4D8] font-bold ml-2">[1] 3813</span>
              <span className="text-[#64748B] italic ml-1"># True distinct artists (d)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
            <span>Ratio m/d: <strong className="text-white">3.155</strong></span>
            <span>·</span>
            <span>R v4.3.2</span>
            <span className="w-2 h-3.5 bg-[#00D26A] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PipelineSimulation = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const playheadRef = useRef({ frame: 0 });
  const targetFrameRef = useRef(0);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TOTAL_FRAMES = 300;

  // Render a specific frame to canvas
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));
    
    // Find requested image or nearest available loaded image
    let img = imagesRef.current[clampedIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame as fallback
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = imagesRef.current[clampedIdx - offset];
        if (left && left.complete && left.naturalWidth > 0) { img = left; break; }
        const right = imagesRef.current[clampedIdx + offset];
        if (right && right.complete && right.naturalWidth > 0) { img = right; break; }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Preload all 300 WebP frames
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i - 1;
      img.src = `/Hashing_example_clip_converted_images/webp/ezgif-frame-${String(i).padStart(3, '0')}.webp`;
      
      const onImageReady = () => {
        count++;
        setLoadedCount(count);
        // If this is the first frame, paint it immediately
        if (idx === 0) {
          drawFrame(0);
        }
      };

      if (img.complete && img.naturalWidth > 0) {
        onImageReady();
      } else {
        img.onload = onImageReady;
      }

      images[idx] = img;
    }

    imagesRef.current = images;

    // Initial paint attempt
    drawFrame(0);

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  // Smoothly scrub to a target frame with GSAP 0.5s ease
  const animateToFrame = (target: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, target));
    targetFrameRef.current = clamped;

    gsap.killTweensOf(playheadRef.current);
    gsap.to(playheadRef.current, {
      frame: clamped,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        const f = Math.round(playheadRef.current.frame);
        setCurrentFrame(f);
        drawFrame(f);
      }
    });
  };

  // Wheel scrubbing handler
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (isPlaying) setIsPlaying(false);

    // 3000px virtual distance mapping
    const delta = e.deltaY;
    const step = (delta / 3000) * TOTAL_FRAMES;
    const nextTarget = targetFrameRef.current + step;
    animateToFrame(nextTarget);
  };

  // Play / Pause auto playback
  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (playheadRef.current.frame >= TOTAL_FRAMES - 1) {
        playheadRef.current.frame = 0;
        targetFrameRef.current = 0;
      }
      playIntervalRef.current = setInterval(() => {
        playheadRef.current.frame = Math.min(TOTAL_FRAMES - 1, playheadRef.current.frame + 1);
        targetFrameRef.current = playheadRef.current.frame;
        const f = Math.round(playheadRef.current.frame);
        setCurrentFrame(f);
        drawFrame(f);

        if (f >= TOTAL_FRAMES - 1) {
          if (playIntervalRef.current) clearInterval(playIntervalRef.current);
          setIsPlaying(false);
        }
      }, 66); // ~15 fps
    }
  };

  const handleReset = () => {
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    setIsPlaying(false);
    playheadRef.current.frame = 0;
    targetFrameRef.current = 0;
    setCurrentFrame(0);
    drawFrame(0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    }
    const val = Number(e.target.value);
    playheadRef.current.frame = val;
    targetFrameRef.current = val;
    setCurrentFrame(val);
    drawFrame(val);
  };

  // Current stage information based on frame index
  const getStageInfo = (f: number) => {
    if (f < 60) {
      return {
        stage: 1,
        title: 'STAGE 1: STREAM TOKEN INGESTION',
        desc: 'Incoming distinct artist strings (x₁, x₂, x₃) pass through the single-pass pipeline',
        accent: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      };
    } else if (f < 120) {
      return {
        stage: 2,
        title: 'STAGE 2: 2-UNIVERSAL DETERMINISTIC HASH',
        desc: 'Applying arithmetic hash family h(x) = (ax + b) mod p with Mersenne prime p = 2⁶¹ - 1',
        accent: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
      };
    } else if (f < 180) {
      return {
        stage: 3,
        title: 'STAGE 3: 61-BIT UNIFORM BINARY PROJECTION',
        desc: 'Pairwise-independent arithmetic maps string space into uniform pseudo-random binary word',
        accent: 'text-blue-400 border-blue-500/40 bg-blue-500/10'
      };
    } else if (f < 240) {
      return {
        stage: 4,
        title: 'STAGE 4: TRAILING ZERO LUCK EXTRACTION',
        desc: 'Inspecting least significant bits: tz(h(x)) geometric probability P(tz ≥ r) = 2⁻ʳ',
        accent: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10'
      };
    } else {
      return {
        stage: 5,
        title: 'STAGE 5: TIDEMARK FILTER & BUCKET SURVIVAL',
        desc: 'Token survives into bucket B if and only if tz(h(x)) ≥ z. Otherwise evicted to save memory',
        accent: 'text-rose-400 border-rose-500/40 bg-rose-500/10'
      };
    }
  };

  const stage = getStageInfo(currentFrame);
  const progressPct = ((currentFrame / (TOTAL_FRAMES - 1)) * 100).toFixed(0);

  return (
    <div 
      className="w-full h-full bg-[#05070B] relative flex flex-col justify-between items-center pointer-events-auto select-none overflow-hidden pt-20 pb-24 px-8"
      onWheel={handleWheel}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* Top Telemetry Header */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyan-400 text-xs uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              Slide 12 / Immersive Storytelling
            </span>
            <span className="text-white/40 text-xs font-mono">
              {loadedCount < TOTAL_FRAMES ? `Caching frames: ${loadedCount}/${TOTAL_FRAMES}` : 'All 300 frames cached ✓'}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            The Hashing & Eviction Pipeline
          </h2>
        </div>

        {/* 5 Stage Badges */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs">
          {[
            { num: 1, label: 'Stream Tokens' },
            { num: 2, 'label': '2-Universal Hash' },
            { num: 3, label: '61-Bit Binary' },
            { num: 4, label: 'Trailing Zeros' },
            { num: 5, label: 'Bucket Filter' }
          ].map((st) => (
            <div
              key={st.num}
              onClick={() => animateToFrame((st.num - 1) * 60 + 10)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                stage.stage === st.num
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                  : 'bg-black/40 border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {st.num}. {st.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2">
        <div className="relative w-full aspect-video max-h-[62vh] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.15)] bg-black/90 flex items-center justify-center">
          <canvas 
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-contain"
          />

          {/* Active Stage Callout Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className={`px-4 py-2 rounded-xl border backdrop-blur-md font-mono text-xs ${stage.accent}`}>
              <div className="font-bold tracking-wider">{stage.title}</div>
              <div className="text-white/70 font-sans text-xs mt-0.5">{stage.desc}</div>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono text-xs text-white/60">
              FRAME <span className="text-cyan-400 font-bold">{String(currentFrame + 1).padStart(3, '0')}</span> / {TOTAL_FRAMES}
            </div>
          </div>

          {/* Scroll Wheel Invitation Hint (fades out once scrubbed) */}
          {currentFrame === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none transition-opacity">
              <div className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse mb-2">
                Scroll Trackpad / Mouse Wheel to Scrub Pipeline
              </div>
              <div className="text-white/50 text-xs font-mono">
                or use the interactive playback bar below
              </div>
            </div>
          )}

          {/* Completion Button Overlay when reaching the end */}
          {currentFrame >= 290 && (
            <button
              onClick={onComplete}
              className="absolute bottom-6 right-6 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer transition-all hover:scale-105 active:scale-95 z-30"
            >
              Continue to Slide 13: The Luck Ladder →
            </button>
          )}
        </div>
      </div>

      {/* Bottom Interactive Playback Scrub Bar */}
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4 z-20 shadow-2xl">
        <button
          onClick={togglePlay}
          className="px-4 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title={isPlaying ? 'Pause' : 'Auto Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl font-mono text-xs transition-all cursor-pointer"
          title="Reset to Frame 0"
        >
          ↺
        </button>

        {/* Scrub Slider */}
        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={TOTAL_FRAMES - 1}
            value={currentFrame}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-grab active:cursor-grabbing accent-cyan-400"
          />
          <div className="font-mono text-xs text-white/50 shrink-0 w-12 text-right">
            {progressPct}%
          </div>
        </div>
      </div>
    </div>
  );
};

export const InequalityWorkbench = () => {
  const [t, setT] = useState(2.0);
  const data = Array.from({ length: 100 }, (_, i) => {
    const x = 0.5 + (i * 4.5) / 100;
    const mu = 2.0; 
    const sigma = 0.6;
    const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) * 100;
    return { x, y };
  });
  const markovBound = Math.min(100, (1 / t) * 100);
  const actualPercent = data.filter(d => d.x >= (t * 2.0)).reduce((acc, curr) => acc + curr.y, 0) / (100/4.5);

  return (
    <div className="bg-[#18111a] rounded-2xl border border-rose-500/30 p-10 w-full shadow-[0_0_60px_-15px_rgba(244,63,94,0.3)] pointer-events-auto"
         onKeyDown={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} onPointerMove={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-rose-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2"><Spline size={16}/> Empirical Tail-Bound Sandbox</h3>
        <div className="flex items-center gap-6 bg-black/60 px-6 py-3 rounded-xl border border-rose-500/20 shadow-inner">
          <span className="text-slate-300 text-sm font-bold">Threshold <InlineMath math="t" />:</span>
          <input 
            type="range" min="1.0" max="3.5" step="0.1" 
            value={t} onChange={(e) => setT(parseFloat(e.target.value))}
            className="w-48 accent-rose-500 cursor-pointer"
          />
          <span className="text-white font-mono font-black text-lg w-16 text-right">{t.toFixed(1)}μ</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-12">
        <div className="bg-black/40 rounded-xl p-8 border border-white/5 flex flex-col justify-center">
          <div className="text-2xl text-white mb-10 border-l-4 border-rose-500 pl-6 py-2 bg-gradient-to-r from-rose-500/10 to-transparent">
            <BlockMath math={`\\mathbb{P}(X \\ge ${t.toFixed(1)}\\mu) \\le \\frac{\\mathbb{E}[X]}{${t.toFixed(1)}\\mu} = ${(markovBound).toFixed(1)}\\%`} />
          </div>
          <div className="space-y-6 font-mono text-base">
            <div className="flex justify-between text-rose-300 items-center">
              <span>Markov Upper Bound (Theory)</span><span className="font-bold text-2xl">{markovBound.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-emerald-400 items-center">
              <span>Actual Observed Area (Data)</span><span className="font-bold text-2xl">{actualPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className="h-80 relative bg-black/30 rounded-xl border border-white/5 pt-6 pr-6 pb-2 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="x" stroke="#666" tick={{fill: '#888', fontSize: 14}} tickFormatter={(val) => `${(val/2.0).toFixed(1)}μ`} />
              <YAxis stroke="#666" tick={{fill: '#888', fontSize: 14}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                formatter={(val: any) => val.toFixed(2)}
                labelFormatter={(val: any) => `At ${(val/2.0).toFixed(1)}μ`}
              />
              <Area type="monotone" dataKey="y" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorY)" />
              <ReferenceLine x={t * 2.0} stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'Cutoff t', fill: '#22d3ee', fontSize: 14, fontWeight: 'bold' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const BucketEvictor = () => {
  return (
    <div className="bg-[#122e1e] rounded-2xl border border-emerald-500/30 p-10 w-full shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)] pointer-events-auto"
         onKeyDown={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} onPointerMove={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">Live BJKST Bucket Simulation</h3>
      </div>
      <div className="grid grid-cols-2 gap-8 font-mono text-lg">
        <div className="bg-black/50 p-6 rounded-xl border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Incoming Token:</span><span className="bg-white/10 px-3 py-1.5 rounded-md text-white font-bold text-xl border border-white/20 shadow-inner">"Seeb"</span>
          </div>
        </div>
      </div>
    </div>
  );
};
