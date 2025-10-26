import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";

export default function Oportunidades() {
    const isMobile = useIsMobile();
    const [filters, setFilters] = useState<FilterOptions>({
        locations: [],
        priceRange: null,
        timePosted: [],
    });

    // Reset filters and sorting
    const handleRefreshPanel = () => {
        setFilters({
            locations: [],
            priceRange: null,
            timePosted: [],
        });
        setSortBy("newest");
        setViewMode("grid");
        setShowChart(false);
    };

    return (
        <div className={`corretores painel-oportunidades transition-all duration-300 ${isMobile ? 'mt-[122px] p-[16px] pb-[88px]' : 'mt-[66px] p-[40px]'}`}>
            {/* Header Info - Desktop Only */}
            {!isMobile && (
                <div className="flex items-center justify-between mb-[24px]">
                    <div className="flex items-center gap-[16px]">
                        <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[20px] text-[#74848b] text-[14px]">
                            12/05/2023
                        </p>
                        <p className="font-['Roboto:Regular',_sans-serif] leading-[22px] text-[#464f53] text-[16px]">
                            <span className="font-['Roboto:Bold',_sans-serif] font-bold">Olá Luciana,</span>
                            {` boas-vindas ao seu painel de corretor.`}
                        </p>
                    </div>
                    <div className="flex items-center gap-[8px]">
                        <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[20px] text-[#74848b] text-[14px]">
                            Há 3 mins atrás
                        </p>
                        <div
                            className="box-border content-stretch flex gap-[16px] h-[36px] items-center justify-center overflow-clip px-[13px] py-[4px] rounded-[10px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                            onClick={handleRefreshPanel}
                        >
                            <p className="font-['Roboto:Bold',_sans-serif] font-bold leading-[22px] relative shrink-0 text-[#464f53] text-[16px] text-nowrap whitespace-pre">
                                Atualizar painel
                            </p>
                            <ArrowPath />
                        </div>
                    </div>
                </div>
            )}

            {/* Banner - Desktop Only */}
            {!isMobile && showBanner && (
                <div className="bg-white h-[102px] relative rounded-[10px] mb-[24px]">
                    <div aria-hidden="true" className="absolute border border-[#e0e7eb] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)]" />
                    <div className="size-full">
                        <div className="box-border content-stretch flex gap-[16px] h-[102px] items-center px-[24px] py-[16px] relative w-full">
                            <div className="aspect-[101/112] h-full relative shrink-0">
                                <div className="absolute bg-[#01988c] bottom-[2.15%] left-[4.26%] right-0 rounded-tl-[300px] rounded-tr-[300px] top-[11.16%]" />
                                <UndrawIllustration />
                            </div>
                            <div className="flex flex-col font-['Roboto:Bold',_sans-serif] font-bold justify-center leading-[22px] relative shrink-0 text-[#464f53] text-[16px] flex-1">
                                <p>Explore as oportunidades mais quentes com seus clientes!</p>
                            </div>
                            <div
                                className="absolute box-border content-stretch flex gap-[16px] h-[36px] items-center justify-center overflow-clip px-[13px] py-[4px] right-[8px] rounded-[10px] top-[8px] hover:bg-[#f6f8f9] cursor-pointer transition-colors"
                                onClick={() => setShowBanner(false)}
                            >
                                <XMark />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Filter and Sort */}
            {!isMobile && (
                <FilterSort
                    onFilterChange={setFilters}
                    onSortChange={setSortBy}
                    onViewModeChange={setViewMode}
                    onChartToggle={() => setShowChart(true)}
                    viewMode={viewMode}
                    showChart={showChart}
                    isMobile={isMobile}
                />
            )}

            {/* Price Chart */}
            {showChart && (
                <PriceChart onClose={() => setShowChart(false)} />
            )}

            {/* Content - Grid or List */}
            {viewMode === "grid" ? (
                <div className="grid gap-[19px]" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(354px, 1fr))' }}>
                    {filteredAndSortedOpportunities.length > 0 ? (
                        filteredAndSortedOpportunities.map((opportunity, index) => (
                            <OpportunityCard key={index} {...opportunity} isMobile={isMobile} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-[60px]">
                            <p className="font-['Roboto:Bold',_sans-serif] font-bold text-[#74848b] text-[18px]">
                                Nenhuma oportunidade encontrada
                            </p>
                            <p className="font-['Roboto:Regular',_sans-serif] text-[#74848b] text-[14px] mt-[8px]">
                                Tente ajustar os filtros para ver mais resultados
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-[16px]">
                    {filteredAndSortedOpportunities.length > 0 ? (
                        filteredAndSortedOpportunities.map((opportunity, index) => (
                            <OpportunityListItem key={index} {...opportunity} isMobile={isMobile} />
                        ))
                    ) : (
                        <div className="text-center py-[60px]">
                            <p className="font-['Roboto:Bold',_sans-serif] font-bold text-[#74848b] text-[18px]">
                                Nenhuma oportunidade encontrada
                            </p>
                            <p className="font-['Roboto:Regular',_sans-serif] text-[#74848b] text-[14px] mt-[8px]">
                                Tente ajustar os filtros para ver mais resultados
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}