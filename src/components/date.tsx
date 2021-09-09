import { parseISO, format } from "date-fns";

type Props = {
    dateString: string
}
export const Date: React.FC<Props>=(props)=>{
    const {dateString} = props;
    const date = parseISO(dateString)
    return (
        <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
    )
} 