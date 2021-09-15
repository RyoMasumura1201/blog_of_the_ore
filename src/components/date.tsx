import { parseISO, format } from "date-fns";
import { VFC } from "react";

type Props = {
    dateString: string
}
export const Date: VFC<Props>=(props)=>{
    const {dateString} = props;
    const date = parseISO(dateString)
    return (
        <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
    )
} 