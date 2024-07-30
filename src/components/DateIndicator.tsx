
import { getRelativeDateTime, isSameDay } from '../lib/utils';

const DateIndicator = ({ message, previousMessage }: any) => {

  return (
    <>
      {!previousMessage || isSameDay(previousMessage._creationTime, message._creationTime) ? (
        <div className='chat_day'>
          <p >
            {getRelativeDateTime(message._creationTime, previousMessage._creationTime)}
          </p>
        </div>
      ) : null}
    </>
  );
};
export default DateIndicator;
