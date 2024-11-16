// services/OutfitsService.js
const Outfits = require('../Models/Outfits');
const ClothingItems = require('../Models/Clothingitems');
const OutfitItems = require('../Models/OutfitItems');

const createOutfit = async (name, occasion, season, image_url, user_id) => {
    try {
        const outfit = await Outfits.create({
            name,
            occasion,
            season,
            image_url,
            user_id
        });
        return outfit;
    } catch (err) {
        console.error('Error creating outfit:', err);
        throw new Error('Failed to create outfit');
    }    
};

const getOutfitById = async (id) => {
    try {
        const outfit = await Outfits.findOne({
            where: { outfit_id: id },
            include: [{
                model: ClothingItems,
                through: {
                    model: OutfitItems,
                    attributes: ['position', 'scale', 'position_index']
                }
            }]
        });

        if (!outfit) {
            return null;
        }

        const plainOutfit = outfit.get({ plain: true });
        
        return {
            ...plainOutfit,
            ClothingItems: plainOutfit.ClothingItems?.map(item => {
                try {
                    const outfitItemData = item.OutfitItems || {};
                    const positionString = outfitItemData.position;
                    
                    return {
                        ...item,
                        position: positionString ? JSON.parse(positionString) : { x: 0, y: 0 },
                        scale: outfitItemData.scale || 1,
                        position_index: outfitItemData.position_index || 0
                    };
                } catch (err) {
                    return {
                        ...item,
                        position: { x: 0, y: 0 },
                        scale: 1,
                        position_index: 0
                    };
                }
            }) || []
        };
    } catch (err) {
        console.error('Error getting outfit by ID:', err);
        throw new Error('Failed to get outfit');
    }
};

const getOutfitsByUserId = async (user_id) => {
    try {
        const outfits = await Outfits.findAll({ 
            where: { user_id },
            include: [{
                model: ClothingItems,
                through: {
                    model: OutfitItems,
                    attributes: ['position', 'scale', 'position_index']
                }
            }],
            order: [['created_at', 'DESC']]
        });

        // Log raw data for debugging
        console.log('Raw outfits data:', JSON.stringify(outfits, null, 2));

        if (!outfits) {
            return [];
        }

        // Transform the data safely
        const transformedOutfits = outfits.map(outfit => {
            const plainOutfit = outfit.get({ plain: true });
            
            // Ensure ClothingItems exists and handle each item carefully
            const transformedItems = plainOutfit.ClothingItems?.map(item => {
                try {
                    // Access OutfitItem data using the correct path
                    const outfitItemData = item.OutfitItems || {};
                    const positionString = outfitItemData.position;
                    
                    return {
                        ...item,
                        position: positionString ? JSON.parse(positionString) : { x: 0, y: 0 },
                        scale: outfitItemData.scale || 1,
                        position_index: outfitItemData.position_index || 0
                    };
                } catch (err) {
                    console.error('Error transforming item:', err);
                    // Return item with default values if transformation fails
                    return {
                        ...item,
                        position: { x: 0, y: 0 },
                        scale: 1,
                        position_index: 0
                    };
                }
            }) || [];

            return {
                ...plainOutfit,
                ClothingItems: transformedItems
            };
        });

        return transformedOutfits;
    } catch (err) {
        console.error('Error getting outfits:', err);
        throw new Error('Failed to get outfits');
    }
};


const getOutfitBySeason = async (user_id, season) => {
    try {
        const outfits = await Outfits.findAll({ 
            where: { user_id, season },
            include: [{
                model: ClothingItems,
                through: {
                    attributes: ['position', 'scale', 'position_index']
                }
            }]
        });
        return outfits;
    } catch (err) {
        console.error('Error getting outfits:', err);
        throw new Error('Failed to get outfits');
    }
};

const getOutfitByOccasion = async (user_id, occasion) => {
    try {
        const outfits = await Outfits.findAll({ 
            where: { user_id, occasion },
            include: [{
                model: ClothingItems,
                through: {
                    attributes: ['position', 'scale', 'position_index']
                }
            }]
        });
        return outfits;
    } catch (err) {
        console.error('Error getting outfits:', err);
        throw new Error('Failed to get outfits');
    }
};

const updateOutfit = async (id, name, occasion, season, image_url) => {
    try {
        const outfit = await Outfits.findByPk(id);
        if (!outfit) {
            throw new Error('Outfit not found');
        }

        const updated = await outfit.update({
            name,
            occasion,
            season,
            image_url
        });
        return updated;
    } catch (err) {
        console.error('Error updating outfit:', err);
        throw new Error('Failed to update outfit');
    }
};

const deleteOutfit = async (id) => {
    try {
        const outfit = await Outfits.findByPk(id);
        if (!outfit) {
            throw new Error('Outfit not found');
        }
        await outfit.destroy();
        return true;
    } catch (err) {
        console.error('Error deleting outfit:', err);
        throw new Error('Failed to delete outfit');
    }
};

module.exports = {
    createOutfit,
    getOutfitById,
    getOutfitsByUserId,
    getOutfitBySeason,
    getOutfitByOccasion,
    updateOutfit,
    deleteOutfit
};