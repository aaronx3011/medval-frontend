interface amountCardProps {
    titlle: string,
    value: string,
    value2?: string,
}

export default function amountCard({ titlle, value, value2 = '' }: amountCardProps) {
    return (
        <div>
            <p className="text-sm text-slate-400 uppercase">
                {titlle}
            </p>
            <div className={`flex-row flex ${value2 === '' ? 'justify-start' : 'justify-around'} items-center`}>
                <p className="font-display text-3xl font-bold text-brand-orange mt-2">
                    {value}$
                </p>
                {value2 === '' ? (<></>) : (

                    <p className="font-display text-3xl font-semibold text-brand-navy-light mt-2">
                        {value2}u
                    </p>

                )}
            </div>
        </div >
    )
}
