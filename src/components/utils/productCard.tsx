interface productCardProps {
    titlle: string,
    value: string,
}

export default function ProuctCard({ titlle, value }: productCardProps) {
    return (
        <div className="min-w-0">
            <p className="text-xs sm:text-sm text-slate-400 uppercase leading-tight break-words h-8 sm:h-auto">
                {titlle}
            </p>
            <div className="flex justify-end px-[2%] sm:px-[5%]">
                <p className="font-display text-lg sm:text-xl lg:text-3xl font-bold text-brand-orange mt-2 leading-tight text-right break-words line-clamp-2">
                    {value}
                </p>
            </div>

        </div >
    )
}
