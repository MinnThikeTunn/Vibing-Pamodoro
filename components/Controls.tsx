
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw, Square, SkipForward } from 'lucide-react-native';
import { TimerMode, TimerPhase } from '../types';

interface ControlsProps {
  isRunning: boolean;
  mode: TimerMode;
  phase: TimerPhase;
  onToggle: () => void;
  onReset: () => void;
  onStop: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isRunning, mode, phase, onToggle, onReset, onStop }) => {
  const isVibing = mode === TimerMode.VIBING;
  const isRest = phase === TimerPhase.REST;

  const getPrimaryColor = () => {
    if (isVibing) return '#a855f7';
    if (isRest) return '#10b981';
    return '#3b82f6';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={isVibing ? onStop : onReset}
        style={styles.sideButton}
      >
        {isVibing ? <Square size={28} color="rgba(255,255,255,0.4)" /> : <RotateCcw size={28} color="rgba(255,255,255,0.4)" />}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onToggle}
        style={[styles.mainButton, { backgroundColor: getPrimaryColor() }]}
      >
        {isRunning ? (
          <Pause size={42} color="#FFF" fill="#FFF" />
        ) : (
          <Play size={42} color="#FFF" fill="#FFF" style={{ marginLeft: 6 }} />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.sideButton}>
        <SkipForward size={28} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  sideButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 88,
    height: 88,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  }
});

export default Controls;
