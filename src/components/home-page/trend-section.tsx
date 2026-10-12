import TrendCarausal from "@/components/trend-item";
import { Render } from "@/components/conditional";

interface TrendSectionProps {
  trends?: any[];
  styles?: any;
}

const TrendSection = ({ trends = [], styles }: TrendSectionProps) => {
  return (
    <Render
      when={trends && trends.length > 0}
      show={<TrendCarausal trends={trends} styles={styles} />}
    />
  );
};

export default TrendSection;
