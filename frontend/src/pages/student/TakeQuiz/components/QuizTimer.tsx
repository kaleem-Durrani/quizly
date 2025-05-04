import React, { useState, useEffect } from 'react';
import { Card, Typography, Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface QuizTimerProps {
  initialTime: number; // in seconds
  onTimeExpired: () => void;
}

/**
 * Quiz Timer Component
 * Displays a countdown timer for the quiz
 */
const QuizTimer: React.FC<QuizTimerProps> = ({ initialTime, onTimeExpired }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    return Math.round((timeLeft / initialTime) * 100);
  };
  
  // Get progress status and color
  const getProgressStatus = (): { status: 'success' | 'active' | 'exception'; color: string } => {
    const percentage = calculateProgress();
    
    if (percentage > 50) {
      return { status: 'success', color: 'green' };
    } else if (percentage > 20) {
      return { status: 'active', color: 'orange' };
    } else {
      return { status: 'exception', color: 'red' };
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeExpired();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);
  
  const { status, color } = getProgressStatus();
  
  return (
    <Card className="flex items-center p-2 shadow-sm" style={{ width: 200 }}>
      <div className="flex items-center mb-2">
        <ClockCircleOutlined className="mr-2" style={{ color }} />
        <Text strong style={{ color }}>Time Remaining</Text>
      </div>
      
      <div className="text-center mb-2">
        <Text style={{ fontSize: '1.5rem', color }}>{formatTime(timeLeft)}</Text>
      </div>
      
      <Progress 
        percent={calculateProgress()} 
        status={status} 
        showInfo={false} 
        size="small" 
      />
    </Card>
  );
};

export default QuizTimer;
