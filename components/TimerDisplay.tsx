
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { TimerMode, TimerPhase, TimerState } from '../types';
import { NORMAL_WORK_SECONDS, NORMAL_REST_SECONDS } from '../constants';

interface TimerDisplayProps {
  state: TimerState;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ state }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerValue = () => {
    if (state.mode === TimerMode.VIBING) return state.elapsedSeconds;
    const limit = state.phase === TimerPhase.WORK ? NORMAL_WORK_SECONDS : NORMAL_REST_SECONDS;
    return Math.max(0, limit - state.elapsedSeconds);
  };

  const getProgress = () => {
    if (state.mode === TimerMode.VIBING) return 0;
    const limit = state.phase === TimerPhase.WORK ? NORMAL_WORK_SECONDS : NORMAL_REST_SECONDS;
    return Math.min(1, state.elapsedSeconds / limit);
  };

  const isVibing = state.mode === TimerMode.VIBING;
  const isRest = state.phase === TimerPhase.REST;
  
  const accentColor = isVibing ? '#a855f7' : (isRest ? '#34d399' : '#3b82f6');
  
  const size = 280;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - getProgress() * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth - 4}
          fill="transparent"
        />
        {/* Progress Circle */}
        {!isVibing && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={accentColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </Svg>

      <View style={styles.labelContainer}>
        <Text style={[styles.timerText, isVibing && styles.vibingText]}>
          {formatTime(getTimerValue())}
        </Text>
        
        <View style={styles.statusSection}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: `${accentColor}1A`, borderColor: `${accentColor}33` }
          ]}>
            <Text style={[styles.statusBadgeText, { color: accentColor }]}>
              {isVibing ? 'VIBING IN FLOW' : isRest ? 'EARNED REST' : 'FOCUS SESSION'}
            </Text>
          </View>
          <Text style={styles.hintText}>
            {isVibing ? 'Stay in the zone' : isRest ? 'Time to recharge' : 'Goal: 50m / 10m'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  vibingText: {
    color: '#a855f7',
  },
  statusSection: {
    marginTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  hintText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500',
  }
});

export default TimerDisplay;
