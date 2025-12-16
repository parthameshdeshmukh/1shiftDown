import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addFavorite = async (req: Request, res: Response) => {
    try {
        const { userId, carId, isNew, data } = req.body;

        if (!userId || !carId || !data) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId,
                carId,
                isNew,
                data: JSON.stringify(data),
            },
        });
        res.json(favorite);
    } catch (error) {
        console.error("Error adding favorite:", error);
        // Handle unique constraint violation gracefully
        res.status(500).json({ error: "Failed to add favorite" });
    }
};

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const { userId, carId } = req.body; // Using body for delete to keep consistent with hook logic easily

        // Ideally DELETE requests should use params, but for simplicity with our hook structure we can use body or query
        // Let's support both query if needed, but here we expect body or query params.
        // Actually, RESTful delete usually is /favorites/:id or /favorites?userId=...&carId=...
        // Let's assume the frontend sends a DELETE request with JSON body for userId and carId to identify the resource precisely without exposing internal DB ID to frontend logic heavily if not needed.
        // Alternatively, we can find by userId + carId and delete.

        if (!userId || !carId) {
            res.status(400).json({ error: "Missing userId or carId" });
            return;
        }

        const deleted = await prisma.favorite.deleteMany({
            where: {
                userId,
                carId,
            },
        });

        res.json({ success: true, count: deleted.count });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            res.status(400).json({ error: "Missing or invalid userId" });
            return;
        }

        const favorites = await prisma.favorite.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        // Parse the JSON string back to object for the frontend
        const parsedFavorites = favorites.map(fav => ({
            ...fav,
            data: JSON.parse(fav.data)
        }));

        res.json(parsedFavorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
};
