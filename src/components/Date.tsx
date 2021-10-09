import { parseISO, format } from "date-fns";
import { VFC, memo } from "react";

type Props = {
    dateString: string
}
const Date: VFC<Props>= (props)=>{
    const {dateString} = props;
    const date = parseISO(dateString)
    return (
        <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
    )
}

export default memo(Date);