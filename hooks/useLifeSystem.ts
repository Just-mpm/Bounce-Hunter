
import { useState, useEffect, useCallback, useMemo } from 'react';
import { MAX_LIVES, LIFE_REGEN_MINUTES, STORAGE_KEYS } from '../constants';
import { type LifeSystem } from '../types';

const LIFE_REGEN_MS = LIFE_REGEN_MINUTES * 60 * 1000;

const useLifeSystem = (): LifeSystem => {
    const [lives, setLives] = useState<number>(() => {
        try {
            const savedLives = localStorage.getItem(STORAGE_KEYS.LIVES);
            return savedLives ? parseInt(savedLives, 10) : MAX_LIVES;
        } catch (e) {
            return MAX_LIVES;
        }
    });

    const [lastUsedTimestamp, setLastUsedTimestamp] = useState<number>(() => {
        try {
            const savedTimestamp = localStorage.getItem(STORAGE_KEYS.LAST_USED_TIMESTAMP);
            return savedTimestamp ? parseInt(savedTimestamp, 10) : Date.now();
        } catch(e) {
            return Date.now();
        }
    });
    
    const [timeToNextLife, setTimeToNextLife] = useState<number>(0);
    
    const isMaxLives = lives >= MAX_LIVES;
    const isRegenerating = !isMaxLives;

    const saveState = useCallback((newLives: number, newTimestamp: number) => {
        try {
            localStorage.setItem(STORAGE_KEYS.LIVES, newLives.toString());
            localStorage.setItem(STORAGE_KEYS.LAST_USED_TIMESTAMP, newTimestamp.toString());
        } catch (e) {
            console.error("Could not save to localStorage", e);
        }
    }, []);

    const useLife = useCallback(() => {
        setLives(prevLives => {
            if (prevLives > 0) {
                const newLives = prevLives - 1;
                const newTimestamp = Date.now();
                if (prevLives === MAX_LIVES) { // Start timer only when dropping from max
                    setLastUsedTimestamp(newTimestamp);
                    saveState(newLives, newTimestamp);
                } else {
                    saveState(newLives, lastUsedTimestamp); // Keep old timestamp
                }
                return newLives;
            }
            return 0;
        });
    }, [lastUsedTimestamp, saveState]);

    const addLife = useCallback((amount = 1) => {
        setLives(prevLives => {
            const newLives = Math.min(MAX_LIVES, prevLives + amount);
            if (newLives >= MAX_LIVES) {
                saveState(newLives, Date.now());
            } else {
                 saveState(newLives, lastUsedTimestamp);
            }
            return newLives;
        });
    }, [lastUsedTimestamp, saveState]);

    const refillLives = useCallback(() => {
        setLives(MAX_LIVES);
        saveState(MAX_LIVES, Date.now());
    }, [saveState]);

    useEffect(() => {
        // Initial check for regenerated lives on load
        if (lives < MAX_LIVES) {
            const timePassed = Date.now() - lastUsedTimestamp;
            const livesRegenerated = Math.floor(timePassed / LIFE_REGEN_MS);

            if (livesRegenerated > 0) {
                const newLives = Math.min(MAX_LIVES, lives + livesRegenerated);
                const newTimestamp = lastUsedTimestamp + (livesRegenerated * LIFE_REGEN_MS);
                setLives(newLives);
                setLastUsedTimestamp(newTimestamp);
                saveState(newLives, newTimestamp);
            }
        }
    }, []); // Run only once on mount

    useEffect(() => {
        let timer: number | undefined;
        if (isRegenerating) {
            const updateTimer = () => {
                const timePassed = Date.now() - lastUsedTimestamp;
                const remainingTime = LIFE_REGEN_MS - (timePassed % LIFE_REGEN_MS);
                
                if(timePassed >= LIFE_REGEN_MS){
                     const livesToRegen = Math.floor(timePassed / LIFE_REGEN_MS);
                     const newLives = Math.min(MAX_LIVES, lives + livesToRegen);
                     const newTimestamp = lastUsedTimestamp + (livesToRegen * LIFE_REGEN_MS);
                     setLives(newLives);
                     setLastUsedTimestamp(newTimestamp);
                     saveState(newLives, newTimestamp);
                } else {
                    setTimeToNextLife(Math.ceil(remainingTime / 1000));
                }
            };
            
            updateTimer();
            timer = window.setInterval(updateTimer, 1000);
        } else {
            setTimeToNextLife(0);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [lives, lastUsedTimestamp, isRegenerating, saveState]);

    return useMemo(() => ({
        lives,
        maxLives: MAX_LIVES,
        isMaxLives,
        timeToNextLife,
        isRegenerating,
        useLife,
        addLife,
        refillLives,
    }), [lives, isMaxLives, timeToNextLife, isRegenerating, useLife, addLife, refillLives]);
};

export default useLifeSystem;