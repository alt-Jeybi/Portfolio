import { Card, CardHeader } from '../Card';
import profileData from '../../data/profile.json';
import styles from './Goals.module.css';

const MAX_GOALS = 3;

// Target icon SVG component
function TargetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Limit display to 3 goals maximum
const displayGoals = (profileData.goals as string[]).slice(0, MAX_GOALS);

interface GoalItemProps {
  goal: string;
  index: number;
}

function GoalItem({ goal }: GoalItemProps) {
  return (
    <li className={styles.goalItem} data-testid="goal-item">
      <span className={styles.goalText} data-testid="goal-text">
        {goal}
      </span>
    </li>
  );
}

export function Goals() {
  return (
    <Card className={styles.goalsCard}>
      <CardHeader icon={<TargetIcon />} title="Goals" />
      <ul className={styles.goalsList} data-testid="goals-list">
        {displayGoals.map((goal, index) => (
          <GoalItem key={index} goal={goal} index={index} />
        ))}
      </ul>
    </Card>
  );
}

export default Goals;
