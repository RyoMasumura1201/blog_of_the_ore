import { parseISO, format } from "date-fns";
import { VFC, memo } from "react";

type Props = {
    dateString: string
}
const Date: VFC<Props>= (props)=>{
    const {dateString} = props;
    const date = parseISO(dateString)
    return (
        <time dateTime={dateString}>{format(date, 'yyyy-MM-dd')}</time>
    )
}

export default memo(Date);