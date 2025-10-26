import { useState } from "react";
import { ViewGridIcon, ViewListIcon, CheckboxEmptyIcon, CheckboxFilledIcon, RadioEmptyIcon, RadioFilledIcon, ChartBarIcon } from "./Icons";
import { Popover } from "@mui/material";

export type ViewMode = "grid" | "list";

const svgPaths = {
    p17e3a380: "M11.6667 10V16.5667C11.7 16.8167 11.6167 17.0833 11.425 17.2583C11.1 17.5833 10.575 17.5833 10.25 17.2583L8.575 15.5833C8.38333 15.3917 8.3 15.1333 8.33333 14.8917V10H8.30833L3.50833 3.85C3.225 3.49167 3.29167 2.96667 3.65 2.68333C3.80833 2.56667 3.98333 2.5 4.16667 2.5H15.8333C16.0167 2.5 16.1917 2.56667 16.35 2.68333C16.7083 2.96667 16.775 3.49167 16.4917 3.85L11.6917 10H11.6667Z",
    p2c39a300: "M2 3.75C2 3.33579 2.33579 3 2.75 3H14.25C14.6642 3 15 3.33579 15 3.75C15 4.16421 14.6642 4.5 14.25 4.5H2.75C2.33579 4.5 2 4.16421 2 3.75ZM2 7.5C2 7.08579 2.33579 6.75 2.75 6.75H10.2582C10.6724 6.75 11.0082 7.08579 11.0082 7.5C11.0082 7.91421 10.6724 8.25 10.2582 8.25H2.75C2.33579 8.25 2 7.91421 2 7.5ZM14 7C14.4142 7 14.75 7.33579 14.75 7.75L14.75 14.3401L16.7004 12.2397C16.9823 11.9361 17.4568 11.9186 17.7603 12.2004C18.0639 12.4823 18.0814 12.9568 17.7996 13.2603L14.5496 16.7603C14.4077 16.9132 14.2085 17 14 17C13.7914 17 13.5923 16.9132 13.4504 16.7603L10.2004 13.2603C9.91855 12.9568 9.93613 12.4823 10.2397 12.2004C10.5432 11.9186 11.0177 11.9361 11.2996 12.2397L13.25 14.3401L13.25 7.75C13.25 7.33579 13.5858 7 14 7ZM2 11.25C2 10.8358 2.33579 10.5 2.75 10.5H7.31205C7.72626 10.5 8.06205 10.8358 8.06205 11.25C8.06205 11.6642 7.72626 12 7.31205 12H2.75C2.33579 12 2 11.6642 2 11.25Z",
}

const svgPathsQt = {
    p17d93400: "M15.8333 2.5H4.16667C3.24167 2.5 2.5 3.24167 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V4.16667C17.5 3.24167 16.75 2.5 15.8333 2.5ZM15.8333 4.16667V15.8333H4.16667V4.16667H15.8333Z",
    p1e32100: "M10 16.6667C8.23189 16.6667 6.5362 15.9643 5.28595 14.714C4.03571 13.4638 3.33333 11.7681 3.33333 10C3.33333 8.23189 4.03571 6.5362 5.28595 5.28595C6.5362 4.03571 8.23189 3.33333 10 3.33333C11.7681 3.33333 13.4638 4.03571 14.714 5.28595C15.9643 6.5362 16.6667 8.23189 16.6667 10C16.6667 11.7681 15.9643 13.4638 14.714 14.714C13.4638 15.9643 11.7681 16.6667 10 16.6667ZM10 1.66667C8.90565 1.66667 7.82202 1.88221 6.81097 2.301C5.79992 2.71979 4.88126 3.33362 4.10744 4.10744C2.54464 5.67025 1.66667 7.78986 1.66667 10C1.66667 12.2101 2.54464 14.3298 4.10744 15.8926C4.88126 16.6664 5.79992 17.2802 6.81097 17.699C7.82202 18.1178 8.90565 18.3333 10 18.3333C12.2101 18.3333 14.3298 17.4554 15.8926 15.8926C17.4554 14.3298 18.3333 12.2101 18.3333 10C18.3333 8.90565 18.1178 7.82202 17.699 6.81097C17.2802 5.79992 16.6664 4.88126 15.8926 4.10744C15.1187 3.33362 14.2001 2.71979 13.189 2.301C12.178 1.88221 11.0943 1.66667 10 1.66667Z",
}

const svgPathsDg = {
    p29ad2280: "M6.28033 5.21967C5.98744 4.92678 5.51256 4.92678 5.21967 5.21967C4.92678 5.51256 4.92678 5.98744 5.21967 6.28033L8.93934 10L5.21967 13.7197C4.92678 14.0126 4.92678 14.4874 5.21967 14.7803C5.51256 15.0732 5.98744 15.0732 6.28033 14.7803L10 11.0607L13.7197 14.7803C14.0126 15.0732 14.4874 15.0732 14.7803 14.7803C15.0732 14.4874 15.0732 14.0126 14.7803 13.7197L11.0607 10L14.7803 6.28033C15.0732 5.98744 15.0732 5.51256 14.7803 5.21967C14.4874 4.92678 14.0126 4.92678 13.7197 5.21967L10 8.93934L6.28033 5.21967Z",
}

interface FilterTagProps {
    label: string;
    onRemove: () => void;
}

export function FilterTag({ label, onRemove }: FilterTagProps) {
    return (
        <div className="relative rounded-[10px] shrink-0">
            <div className="box-border content-stretch flex gap-[16px] items-center justify-center overflow-clip pl-[10px] pr-[12px] py-[4px] relative rounded-[inherit]">
                <p
                    className="font-['Roboto:Bold',_sans-serif] font-bold leading-[20px] relative shrink-0 text-[#01988c] text-[14px] text-nowrap whitespace-pre"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                >
                    {label}
                </p>
                <div
                    className="relative shrink-0 size-[20px] cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={onRemove}
                >
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                        <g id="heroicons-mini/x-mark">
                            <path d={svgPathsDg.p29ad2280} fill="var(--fill-0, #01988C)" id="Union" />
                        </g>
                    </svg>
                </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#01988c] border-solid inset-0 pointer-events-none rounded-[10px]" />
        </div>
    );
}


interface FilterSortProps {
    onFilterChange?: (filters: FilterOptions) => void;
    onSortChange?: (sortBy: SortOption) => void;
    onViewModeChange?: (viewMode: ViewMode) => void;
    onChartToggle?: () => void;
    viewMode?: ViewMode;
    showChart?: boolean;
    isMobile?: boolean;
}

export interface FilterOptions {
    locations: string[]
    ;
    priceRange: {
        min: number;
        max: number;
    } | null;
    timePosted: string[];
}

export type SortOption =
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "discount-high";

const locations = [
    "Botafogo",
    "Catete",
    "Copacabana",
    "Flamengo",
    "Ipanema",
    "Jardim Oceânico",
    "Jardim Botânico",
    "Leblon",
    "Tijuca",
];

const timePostedOptions = [
    { value: "recent", label: "Últimos 7 dias" },
    { value: "week", label: "Última semana" },
    { value: "month", label: "Último mês" },
    { value: "older", label: "Mais de 1 mês" },
];

const priceRanges = [
    { label: "Até R$ 500 mil", min: 0, max: 500000 },
    { label: "R$ 500 mil - R$ 1 milhão", min: 500000, max: 1000000 },
    { label: "R$ 1 milhão - R$ 2 milhões", min: 1000000, max: 2000000 },
    { label: "R$ 2 milhões - R$ 3 milhões", min: 2000000, max: 3000000 },
    { label: "Acima de R$ 3 milhões", min: 3000000, max: Infinity },
];

const sortOptions = [
    { value: "newest", label: "Mais recentes" },
    { value: "oldest", label: "Mais antigos" },
    { value: "price-low", label: "Menor preço" },
    { value: "price-high", label: "Maior preço" },
    { value: "discount-high", label: "Maior desconto" },
];

function FilterIcon() {
    return (
        <div className="relative shrink-0 size-[20px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d={svgPaths.p17e3a380} fill="var(--fill-0, #01988C)" />
            </svg>
        </div>
    );
}

function SortIcon() {
    return (
        <div className="relative shrink-0 size-[18px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p2c39a300} fill="var(--fill-0, #01988C)" />
            </svg>
        </div>
    );
}

export function FilterSort({ onFilterChange, onSortChange, onViewModeChange, onChartToggle, viewMode = "grid", showChart = false, isMobile = false }: FilterSortProps) {
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
    const [selectedTimePosted, setSelectedTimePosted] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const handleLocationChange = (location: string, checked: boolean) => {
        const newLocations = checked
            ? [...selectedLocations, location]
            : selectedLocations.filter((l) => l !== location);
        setSelectedLocations(newLocations);

        onFilterChange?.({
            locations: newLocations,
            priceRange: selectedPriceRange !== null ? priceRanges[selectedPriceRange] : null,
            timePosted: selectedTimePosted,
        });
    };

    const handlePriceRangeChange = (index: number, checked: boolean) => {
        const newIndex = checked ? index : null;
        setSelectedPriceRange(newIndex);

        onFilterChange?.({
            locations: selectedLocations,
            priceRange: newIndex !== null ? priceRanges[newIndex] : null,
            timePosted: selectedTimePosted,
        });
    };

    const handleTimePostedChange = (value: string, checked: boolean) => {
        const newTimePosted = checked
            ? [...selectedTimePosted, value]
            : selectedTimePosted.filter((t) => t !== value);
        setSelectedTimePosted(newTimePosted);

        onFilterChange?.({
            locations: selectedLocations,
            priceRange: selectedPriceRange !== null ? priceRanges[selectedPriceRange] : null,
            timePosted: newTimePosted,
        });
    };

    const handleSortChange = (value: SortOption) => {
        setSortBy(value);
        onSortChange?.(value);
    };

    const handleClearFilters = () => {
        setSelectedLocations([]);
        setSelectedPriceRange(null);
        setSelectedTimePosted([]);

        onFilterChange?.({
            locations: [],
            priceRange: null,
            timePosted: [],
        });
    };

    const handleClearSort = () => {
        setSortBy("newest");
        onSortChange?.("newest");
    };

    const activeFiltersCount =
        selectedLocations.length +
        (selectedPriceRange !== null ? 1 : 0) +
        selectedTimePosted.length;

    const handleRemoveLocation = (location: string) => {
        const newLocations = selectedLocations.filter((l) => l !== location);
        setSelectedLocations(newLocations);

        onFilterChange?.(({
            locations: newLocations,
            priceRange: selectedPriceRange !== null ? priceRanges[selectedPriceRange] : null,
            timePosted: selectedTimePosted,
        }));
    };

    const handleRemovePriceRange = () => {
        setSelectedPriceRange(null);

        onFilterChange?.({
            locations: selectedLocations,
            priceRange: null,
            timePosted: selectedTimePosted,
        });
    };

    const handleRemoveTimePosted = (value: string) => {
        const newTimePosted = selectedTimePosted.filter((t) => t !== value);
        setSelectedTimePosted(newTimePosted);

        onFilterChange?.({
            locations: selectedLocations,
            priceRange: selectedPriceRange !== null ? priceRanges[selectedPriceRange] : null,
            timePosted: newTimePosted,
        });
    };

    const handleRemoveSort = () => {
        setSortBy("newest");
        onSortChange?.("newest");
    };

    const getSortLabel = (value: SortOption): string => {
        const option = sortOptions.find((opt) => opt.value === value);
        return option?.label || "";
    };

    const getTimePostedLabel = (value: string): string => {
        const option = timePostedOptions.find((opt) => opt.value === value);
        return option?.label || "";
    };

    return (
        <div className="flex flex-col gap-[16px] mb-[24px]">
            <div className="flex items-center justify-between md:flex-row flex-col md:gap-0 gap-[16px]">
                <div className="flex items-center gap-[16px] md:w-auto w-full md:justify-start justify-center flex-wrap">
                    {/* Filtrar - Hidden on Mobile */}
                    {!isMobile && (
                        <Popover open={filterOpen} onOpenChange={setFilterOpen}>                            
                                <div className="box-border content-stretch flex gap-[16px] h-[44px] items-center justify-center overflow-clip px-[20px] py-[10px] rounded-[10px] bg-white border border-[#e0e7eb] hover:bg-[#f6f8f9] cursor-pointer transition-colors shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)]">
                                    <FilterIcon />
                                    <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre">
                                        Filtrar
                                    </p>
                                </div>
                            
                            <PopoverContent className="w-[816px] p-0 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.04),0px_8px_16px_0px_rgba(0,0,0,0.08)]" align="start" sideOffset={8}>
                                <div className="bg-white rounded-[10px]">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-[16px] py-[14px]">
                                        <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#74848b] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                            Filtrar por:
                                        </p>
                                        <div
                                            className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-center overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                            onClick={handleClearFilters}
                                        >
                                            <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Limpar filtros
                                            </p>
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="h-0 w-full">
                                        <div className="h-[1px] bg-[#f0f3f5]" />
                                    </div>

                                    {/* Content */}
                                    <div className="px-[16px] py-[32px] flex gap-[32px]">
                                        {/* Localização */}
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#464f53] text-[16px] mb-[24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Localização
                                            </p>
                                            {locations.map((location) => {
                                                const isSelected = selectedLocations.includes(location);
                                                return (
                                                    <div
                                                        key={location}
                                                        className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                        onClick={() => handleLocationChange(location, !isSelected)}
                                                    >
                                                        {isSelected ? <CheckboxFilledIcon /> : <CheckboxEmptyIcon />}
                                                        <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                            {location}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Faixa de Preço */}
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#464f53] text-[16px] mb-[24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Faixa de preço
                                            </p>
                                            {priceRanges.map((range, index) => {
                                                const isSelected = selectedPriceRange === index;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                        onClick={() => handlePriceRangeChange(index, !isSelected)}
                                                    >
                                                        {isSelected ? <CheckboxFilledIcon /> : <CheckboxEmptyIcon />}
                                                        <div className="bg-[#f0f3f5] box-border content-stretch flex flex-col items-center justify-center px-[6px] py-0 rounded-[4px]">
                                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[18px] text-[#5d696f] text-[12px] text-center text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                                {range.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Tempo de Publicação */}
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#464f53] text-[16px] mb-[24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Publicado
                                            </p>
                                            {timePostedOptions.map((option) => {
                                                const isSelected = selectedTimePosted.includes(option.value);
                                                return (
                                                    <div
                                                        key={option.value}
                                                        className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                        onClick={() => handleTimePostedChange(option.value, !isSelected)}
                                                    >
                                                        {isSelected ? <CheckboxFilledIcon /> : <CheckboxEmptyIcon />}
                                                        <div className="bg-[#e7f4d7] box-border content-stretch flex flex-col items-center justify-center px-[6px] py-0 rounded-[4px]">
                                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[18px] text-[#6b9539] text-[12px] text-center text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                                {option.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {/* Ordenar - Hidden on Mobile */}
                    {!isMobile && (
                        <Popover open={sortOpen} onOpenChange={setSortOpen}>
                            <PopoverTrigger asChild>
                                <div className="box-border content-stretch flex gap-[16px] h-[44px] items-center justify-center overflow-clip px-[20px] py-[10px] rounded-[10px] bg-white border border-[#e0e7eb] hover:bg-[#f6f8f9] cursor-pointer transition-colors shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)]">
                                    <SortIcon />
                                    <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre">
                                        Ordenar
                                    </p>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[550px] p-0 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.04),0px_8px_16px_0px_rgba(0,0,0,0.08)]" align="start" sideOffset={8}>
                                <div className="bg-white rounded-[10px]">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-[16px] py-[14px]">
                                        <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#74848b] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                            Ordenar por:
                                        </p>
                                        <div
                                            className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-center overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                            onClick={handleClearSort}
                                        >
                                            <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Limpar ordenação
                                            </p>
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="h-0 w-full">
                                        <div className="h-[1px] bg-[#f0f3f5]" />
                                    </div>

                                    {/* Content */}
                                    <div className="px-[16px] py-[32px] flex gap-[32px]">
                                        {/* Data de entrada */}
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#464f53] text-[16px] mb-[24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Data de entrada
                                            </p>
                                            <div
                                                className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                onClick={() => handleSortChange("newest")}
                                            >
                                                {sortBy === "newest" ? <RadioFilledIcon /> : <RadioEmptyIcon />}
                                                <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                    Mais recentes
                                                </p>
                                            </div>
                                            <div
                                                className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                onClick={() => handleSortChange("oldest")}
                                            >
                                                {sortBy === "oldest" ? <RadioFilledIcon /> : <RadioEmptyIcon />}
                                                <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                    Mais antigos
                                                </p>
                                            </div>
                                        </div>

                                        {/* Preço */}
                                        <div className="flex flex-col gap-[8px]">
                                            <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[22px] text-[#464f53] text-[16px] mb-[24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                Preço
                                            </p>
                                            <div
                                                className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                onClick={() => handleSortChange("price-low")}
                                            >
                                                {sortBy === "price-low" ? <RadioFilledIcon /> : <RadioEmptyIcon />}
                                                <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                    Menor preço
                                                </p>
                                            </div>
                                            <div
                                                className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-start overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                                onClick={() => handleSortChange("price-high")}
                                            >
                                                {sortBy === "price-high" ? <RadioFilledIcon /> : <RadioEmptyIcon />}
                                                <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                                    Maior preço
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* View Mode Toggle - Hidden on Mobile */}
                {!isMobile && (
                    <div className="flex items-center gap-[8px] bg-white border border-[#e0e7eb] rounded-[10px] p-[4px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)]">
                        <div
                            className={`box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center overflow-clip px-[12px] py-[8px] rounded-[6px] cursor-pointer transition-all ${viewMode === "grid"
                                ? 'bg-[#edf8f7] text-[#01988c]'
                                : 'hover:bg-[#f6f8f9] text-[#464f53]'
                                }`}
                            onClick={() => onViewModeChange?.("grid")}
                        >
                            <ViewGridIcon />
                        </div>
                        <div
                            className={`box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center overflow-clip px-[12px] py-[8px] rounded-[6px] cursor-pointer transition-all ${viewMode === "list"
                                ? 'bg-[#edf8f7] text-[#01988c]'
                                : 'hover:bg-[#f6f8f9] text-[#464f53]'
                                }`}
                            onClick={() => onViewModeChange?.("list")}
                        >
                            <ViewListIcon />
                        </div>
                    </div>
                )}
            </div>

            {/* Active Filters Tags */}
            {(selectedLocations.length > 0 || selectedPriceRange !== null || selectedTimePosted.length > 0 || sortBy !== "newest") && (
                <div className="flex items-center gap-[8px] flex-wrap">
                    {selectedLocations.map((location) => (
                        <FilterTag
                            key={location}
                            label={location}
                            onRemove={() => handleRemoveLocation(location)}
                        />
                    ))}
                    {selectedPriceRange !== null && (
                        <FilterTag
                            label={priceRanges[selectedPriceRange].label}
                            onRemove={handleRemovePriceRange}
                        />
                    )}
                    {selectedTimePosted.map((timeValue) => (
                        <FilterTag
                            key={timeValue}
                            label={getTimePostedLabel(timeValue)}
                            onRemove={() => handleRemoveTimePosted(timeValue)}
                        />
                    ))}
                    {sortBy !== "newest" && (
                        <FilterTag
                            label={getSortLabel(sortBy)}
                            onRemove={handleRemoveSort}
                        />
                    )}
                </div>
            )}
        </div>
    );
}