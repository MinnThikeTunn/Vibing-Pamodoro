
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { Coffee, History, ArrowRight } from 'lucide-react-native';

interface SummarySheetProps {
  isOpen: boolean;
  vibedSeconds: number;
  onDiscard: () => void;
  onStartRest: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SummarySheet: React.FC<SummarySheetProps> = ({ isOpen, vibedSeconds, onDiscard, onStartRest }) => {
  // Fix: Added isRendered state to properly handle conditional rendering after animation completes
  // without accessing internal _value property of Animated.Value which caused TS errors.
  const [isRendered, setIsRendered] = useState(isOpen);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: false }),
      ]).start(({ finished }) => {
        if (finished) {
          setIsRendered(false);
        }
      });
    }
  }, [isOpen]);

  // Use a conditional render for the entire portal to avoid layout issues when closed
  if (!isRendered) return null;

  const vMins = Math.floor(vibedSeconds / 60);
  const vSecs = Math.floor(vibedSeconds % 60);
  const totalRestSeconds = vibedSeconds / 5;
  const rMins = Math.floor(totalRestSeconds / 60);
  const rSecs = Math.floor(totalRestSeconds % 60);

  return (
    <View style={styles.absoluteLayer} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Zone Breaker 🧘‍♂️</Text>
          <Text style={styles.subtitle}>Incredible session. Time to reward yourself.</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statLabel}>
              <History size={14} color="#a855f7" />
              <Text style={styles.statLabelText}>VIBED</Text>
            </View>
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValMain}>{vMins}</Text>
              <Text style={styles.timeValSub}>MIN</Text>
            </View>
            <View style={styles.timeValueContainerSmall}>
              <Text style={styles.timeValSec}>{vSecs}</Text>
              <Text style={styles.timeValSubSec}>SEC</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.statCardAccent]}>
            <View style={styles.statLabel}>
              <Coffee size={14} color="#3b82f6" />
              <Text style={[styles.statLabelText, { color: '#3b82f6' }]}>EARNED REST</Text>
            </View>
            <View style={styles.timeValueContainer}>
              <Text style={[styles.timeValMain, { color: '#3b82f6' }]}>{rMins}</Text>
              <Text style={[styles.timeValSub, { color: 'rgba(59,130,246,0.6)' }]}>MIN</Text>
            </View>
            <View style={styles.timeValueContainerSmall}>
              <Text style={[styles.timeValSec, { color: 'rgba(59,130,246,0.8)' }]}>{rSecs}</Text>
              <Text style={[styles.timeValSubSec, { color: 'rgba(59,130,246,0.3)' }]}>SEC</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onDiscard} style={styles.discardButton}>
            <Text style={styles.discardText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onStartRest} style={styles.restButton}>
            <Text style={styles.restText}>Start Rest</Text>
            <ArrowRight size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statCardAccent: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statLabelText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
  },
  timeValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  timeValMain: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
  },
  timeValSub: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
  },
  timeValueContainerSmall: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: -2,
  },
  timeValSec: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  timeValSubSec: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  discardButton: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardText: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
  },
  restButton: {
    flex: 2,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  restText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  }
});

export default SummarySheet;
