interface productCardProps {
    titlle: string,
    value: string,
}

export default function ProuctCard({ titlle, value }: productCardProps) {
    return (
        <div>
            <p className="text-sm text-slate-400 uppercase">
                {titlle}
            </p>
            <div className="flex justify-start px-[5%]">
                <p className="font-display text-3xl font-bold text-brand-orange mt-2 overflow-clip truncate" title={value}>
                    {value}
                </p>
            </div>

        </div >
    )
}
