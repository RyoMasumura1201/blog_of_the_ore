import { parseISO, format } from "date-fns";
import { VFC, memo } from "react";

type Props = {
    dateString: string
}
export const Date: VFC<Props>= memo((props)=>{
    const {dateString} = props;
    const date = parseISO(dateString)
    return (
        <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
    )
})