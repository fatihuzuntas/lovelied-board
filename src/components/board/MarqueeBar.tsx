import { MarqueeItem } from '@/types/board';
import Marquee from 'react-fast-marquee';

interface MarqueeBarProps {
  texts: MarqueeItem[];
}

export const MarqueeBar = ({ texts }: MarqueeBarProps) => {
  if (!texts || texts.length === 0) return null;

  return (
    <div className={`bg-primary text-primary-foreground py-2 overflow-hidden shadow-lg flex-shrink-0`}>
      <div className="flex items-center">
        <span className="text-lg px-4 flex-shrink-0">📢</span>
        <div className="flex-1 overflow-hidden">
          <Marquee gradient={false} speed={40} pauseOnHover={true}>
            <div className="inline-flex items-center">
              {texts.map((item, idx) => (
                <span key={item.id || idx} className="pr-5 text-base font-semibold">
                  {item.text}
                </span>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </div>
  );
};
