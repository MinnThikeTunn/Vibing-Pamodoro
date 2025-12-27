
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions,
  Platform
} from 'react-native';
import { TimerMode, TimerPhase, TimerState } from './types';
import { NORMAL_WORK_SECONDS, NORMAL_REST_SECONDS, VIBE_REST_RATIO } from './constants';
import TimerDisplay from './components/TimerDisplay';
import ModeSelector from './components/ModeSelector';
import Controls from './components/Controls';
import SummarySheet from './components/SummarySheet';
import { Settings, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const App: React.FC = () => {
  const [state, setState] = useState<TimerState>({
    mode: TimerMode.NORMAL,
    phase: TimerPhase.WORK,
    isRunning: false,
    elapsedSeconds: 0,
    totalWorkSeconds: 0,
    currentCycle: 1,
    totalCycles: 4,
    showSummary: false,
    lastCalculatedRest: 0,
    lastVibedSeconds: 0
  });

  const timerRef = useRef<any>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = lastTimestampRef.current ? (now - lastTimestampRef.current) / 1000 : 0;
    lastTimestampRef.current = now;

    setState((prev) => {
      const newElapsed = prev.elapsedSeconds + delta;
      
      if (prev.mode === TimerMode.NORMAL) {
        const limit = prev.phase === TimerPhase.WORK ? NORMAL_WORK_SECONDS : NORMAL_REST_SECONDS;
        if (newElapsed >= limit) {
          if (prev.phase === TimerPhase.WORK) {
            return {
              ...prev,
              phase: TimerPhase.REST,
              elapsedSeconds: 0,
              isRunning: true,
              totalWorkSeconds: prev.totalWorkSeconds + NORMAL_WORK_SECONDS
            };
          } else {
            return {
              ...prev,
              phase: TimerPhase.WORK,
              elapsedSeconds: 0,
              isRunning: true,
              currentCycle: (prev.currentCycle % prev.totalCycles) + 1
            };
          }
        }
      }

      return {
        ...prev,
        elapsedSeconds: newElapsed,
        totalWorkSeconds: prev.phase === TimerPhase.WORK ? prev.totalWorkSeconds + delta : prev.totalWorkSeconds
      };
    });
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      lastTimestampRef.current = Date.now();
      timerRef.current = setInterval(tick, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      lastTimestampRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, tick]);

  const toggleTimer = () => setState(prev => ({ ...prev, isRunning: !prev.isRunning }));

  const resetTimer = () => setState(prev => ({
    ...prev,
    isRunning: false,
    elapsedSeconds: 0,
    phase: TimerPhase.WORK,
    currentCycle: 1
  }));

  const switchMode = (mode: TimerMode) => {
    if (state.mode === mode) return;
    setState(prev => ({
      ...prev,
      mode,
      elapsedSeconds: prev.phase === TimerPhase.WORK ? prev.elapsedSeconds : 0,
      phase: TimerPhase.WORK
    }));
  };

  const stopVibing = () => {
    setState(prev => {
      const earnedRest = Math.floor(prev.elapsedSeconds / 60 / VIBE_REST_RATIO);
      return {
        ...prev,
        isRunning: false,
        showSummary: true,
        lastCalculatedRest: earnedRest,
        lastVibedSeconds: prev.elapsedSeconds
      };
    });
  };

  const startRest = () => setState(prev => ({
    ...prev,
    phase: TimerPhase.REST,
    elapsedSeconds: 0,
    isRunning: true,
    showSummary: false
  }));

  const discardSession = () => setState(prev => ({
    ...prev,
    showSummary: false,
    elapsedSeconds: 0,
    isRunning: false,
    phase: TimerPhase.WORK
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Focus Timer</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Settings size={22} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeContainer}>
        <ModeSelector currentMode={state.mode} onSelect={switchMode} />
      </View>

      {/* Timer Body */}
      <View style={styles.timerBody}>
        <TimerDisplay state={state} />
      </View>

      {/* Footer Area */}
      <View style={styles.footer}>
        {state.mode === TimerMode.NORMAL && (
          <View style={styles.cycleCard}>
            <View style={styles.cycleHeader}>
              <View style={styles.cycleLabel}>
                <CheckCircle2 size={14} color="#3b82f6" />
                <Text style={styles.cycleText}>ROUNDS</Text>
              </View>
              <Text style={styles.cycleValue}>{state.currentCycle} of {state.totalCycles}</Text>
            </View>
            <View style={styles.progressBarBg}>
              {Array.from({ length: state.totalCycles }).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.progressSegment,
                    i < state.currentCycle - 1 && styles.progressSegmentFull,
                    i === state.currentCycle - 1 && styles.progressSegmentActive
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <Controls 
          isRunning={state.isRunning} 
          mode={state.mode}
          phase={state.phase}
          onToggle={toggleTimer} 
          onReset={resetTimer} 
          onStop={stopVibing}
        />
      </View>

      <SummarySheet 
        isOpen={state.showSummary} 
        vibedSeconds={state.lastVibedSeconds} 
        onDiscard={discardSession}
        onStartRest={startRest}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
  },
  headerSide: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: -0.5,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  modeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  timerBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 24,
  },
  cycleCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cycleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cycleText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  cycleValue: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  progressBarBg: {
    flexDirection: 'row',
    height: 6,
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressSegmentFull: {
    backgroundColor: '#3b82f6',
  },
  progressSegmentActive: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  }
});

export default App;
