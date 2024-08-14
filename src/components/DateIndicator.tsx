
import { getRelativeDateTime, isSameDay } from '../lib/utils';
import { IMessage } from '../stores/store';



type DateIndicatorProps = {
  message: IMessage;
  previousMessage?: IMessage;
};
const DateIndicator = ({ message, previousMessage }: DateIndicatorProps) => {
  return (
    <>
      {!previousMessage || !isSameDay(previousMessage._creationTime, message._creationTime) ? (
        <div className='data'>
          <p >
            {getRelativeDateTime(message, previousMessage)}
          </p>
        </div>
      ) : null}
    </>
  );
};
export default DateIndicator;
