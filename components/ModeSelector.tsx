
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Timer, Infinity as InfinityIcon } from 'lucide-react-native';
import { TimerMode } from '../types';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelect: (mode: TimerMode) => void;
}

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width - 48;
const SLIDER_WIDTH = (CONTAINER_WIDTH - 8) / 2;

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelect }) => {
  const slideAnim = useRef(new Animated.Value(currentMode === TimerMode.NORMAL ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: currentMode === TimerMode.NORMAL ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [currentMode]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { width: SLIDER_WIDTH, transform: [{ translateX }] }]} />
      
      <TouchableOpacity 
        onPress={() => onSelect(TimerMode.NORMAL)}
        style={styles.option}
      >
        <Timer size={18} color={currentMode === TimerMode.NORMAL ? '#3b82f6' : 'rgba(255,255,255,0.4)'} />
        <Text style={[styles.optionText, currentMode === TimerMode.NORMAL && styles.activeTextNormal]}>
          Normal
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onSelect(TimerMode.VIBING)}
        style={styles.option}
      >
        <InfinityIcon size={18} color={currentMode === TimerMode.VIBING ? '#a855f7' : 'rgba(255,255,255,0.4)'} />
        <Text style={[styles.optionText, currentMode === TimerMode.VIBING && styles.activeTextVibing]}>
          Vibing
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  slider: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  activeTextNormal: { color: '#3b82f6' },
  activeTextVibing: { color: '#a855f7' },
});

export default ModeSelector;
