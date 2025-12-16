import { Router } from 'express';
import { getNewCarRecommendations, getUsedCarListings, generateCarImage } from './controllers/geminiController';
import { addFavorite, removeFavorite, getFavorites } from './controllers/favoritesController';

const router = Router();

router.post('/recommendations', getNewCarRecommendations);
router.post('/listings', getUsedCarListings);
router.post('/generate-image', generateCarImage);

router.post('/favorites/add', addFavorite);
router.post('/favorites/remove', removeFavorite);
router.get('/favorites', getFavorites);

export default router;
