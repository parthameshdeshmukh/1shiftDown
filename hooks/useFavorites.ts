import { useState, useEffect } from 'react';
import { NewCarRecommendation, UsedCarListing, Favorite } from '../types';

// Simple UUID generator for anonymous user
const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = getUserId();

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`/api/favorites?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setFavorites(data);
                } else {
                    console.error("Favorites API returned non-array:", data);
                    setFavorites([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const isFavorite = (carId: string) => {
        return favorites.some(fav => fav.carId === carId);
    };

    const toggleFavorite = async (item: NewCarRecommendation | UsedCarListing, isNew: boolean) => {
        // Generate a consistent ID for the car
        const carId = isNew
            ? `${(item as NewCarRecommendation).makeModel}-${(item as NewCarRecommendation).variant}`.replace(/\s+/g, '-').toLowerCase()
            : (item as UsedCarListing).link; // Use link as ID for listing as it's likely unique enough or use another prop

        const alreadyFavorite = isFavorite(carId);

        if (alreadyFavorite) {
            // Remove
            setFavorites(prev => prev.filter(f => f.carId !== carId)); // Optimistic update
            try {
                await fetch('/api/favorites/remove', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, carId })
                });
            } catch (error) {
                console.error("Failed to remove favorite", error);
                fetchFavorites(); // Revert on error
            }
        } else {
            // Add
            const newFav: Favorite = {
                id: -1, // Temp ID
                userId,
                carId,
                isNew,
                data: item,
                createdAt: new Date().toISOString()
            };
            setFavorites(prev => [newFav, ...prev]); // Optimistic update

            try {
                const response = await fetch('/api/favorites/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, carId, isNew, data: item })
                });
                if (response.ok) {
                    const savedFav = await response.json();
                    // Update user with real ID
                    setFavorites(prev => prev.map(f => f.carId === carId ? { ...savedFav, data: item } : f));
                }
            } catch (error) {
                console.error("Failed to add favorite", error);
                setFavorites(prev => prev.filter(f => f.carId !== carId)); // Revert
            }
        }
    };

    return { favorites, isFavorite, toggleFavorite, loading };
};
